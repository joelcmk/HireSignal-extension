let showSponsoredPosts = true;
let sortPostsByDate = true;
let stateLoaded = false;
let totalRemovedCount = 0;

// Load saved state and counter when content script starts
chrome.storage.sync.get(['showSponsoredPosts', 'totalRemovedCount'], function (result) {
  if (result.showSponsoredPosts !== undefined) {
    showSponsoredPosts = result.showSponsoredPosts;
    console.log('Loaded showSponsoredPosts from storage:', showSponsoredPosts);
  }
  if (result.totalRemovedCount !== undefined) {
    totalRemovedCount = result.totalRemovedCount;
  }
  stateLoaded = true;
  // Initial run when state is loaded
  if (!showSponsoredPosts) {
    removeSponsoredJobs();
  }
});

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action === 'toggleSponsoredPosts') {
    showSponsoredPosts = request.showSponsoredPosts;
    // Save to Chrome storage
    chrome.storage.sync.set({ showSponsoredPosts: showSponsoredPosts });
    console.log('Saved showSponsoredPosts to storage:', showSponsoredPosts);
    if (!showSponsoredPosts) {
      removeSponsoredJobs();
    } else {
      // Reload the page when sponsored posts are shown again
      window.location.reload();
    }
  } else if (request.action === 'toggleSortedPosts') {
    sortPostsByDate = request.sortPostsByDate;
    chrome.storage.sync.set({ sortPostsByDate: sortPostsByDate });
  }

  const jobTitle = getJobTitle();
  const location = getLocation();

  sendResponse({ jobTitle, location });
  return true;
});

function removeSponsoredJobs() {
  let removedCount = 0;

  // Handle the old style of sponsored jobs
  const oldJobDivs = document.querySelectorAll(
    'div.job-card-job-posting-card-wrapper'
  );
  Array.from(oldJobDivs).forEach((jobDiv) => {
    const link = jobDiv.querySelector('a');
    const href = link ? link.getAttribute('href') : null;
    if (href && !href.includes('&eBP=NOT_ELIGIBLE_FOR_CHARGING')) {
      const listItem = jobDiv.closest('li.scaffold-layout__list-item');
      if (listItem) {
        listItem.remove();
        removedCount++;
      }
    }
  });

  // Handle the new style of promoted jobs
  const newJobCards = document.querySelectorAll('div[data-view-name="job-search-job-card"]');
  Array.from(newJobCards).forEach((jobCard) => {
    const paragraphs = Array.from(jobCard.querySelectorAll('p'));
    const isPromoted = paragraphs.some(p => p.textContent.trim() === 'Promoted');
    if (isPromoted) {
      const container = jobCard.parentElement.parentElement;
      if (container) {
        const nextSibling = container.nextElementSibling;
        if (nextSibling && nextSibling.tagName === 'HR') {
          nextSibling.remove();
        }
        container.remove();
        removedCount++;
      }
    }
  });

  if (removedCount > 0) {
    totalRemovedCount += removedCount;
    console.log(`Removed ${removedCount} promoted jobs. Total removed: ${totalRemovedCount}`);

    // Save the updated counter to storage
    chrome.storage.sync.set({ totalRemovedCount: totalRemovedCount });
  }
}

function getJobTitle() {
  const jobTitleInput = document.querySelector(
    'input.jobs-search-box__text-input.jobs-search-box__keyboard-text-input'
  );
  return jobTitleInput ? jobTitleInput.value : null;
}

function getLocation() {
  const locationInput = document.querySelector(
    'input[aria-label="City, state, or zip code"]'
  );
  return locationInput ? locationInput.value : null;
}

// Run immediately when DOM changes
const observer = new MutationObserver(() => {
  if (!showSponsoredPosts && (document.querySelector('div.job-card-job-posting-card-wrapper') || document.querySelector('div[data-view-name="job-search-job-card"]'))) {
    removeSponsoredJobs();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Also listen for URL changes (page transitions)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (!showSponsoredPosts) {
      setTimeout(removeSponsoredJobs, 1000);
    }
  }
}).observe(document, { subtree: true, childList: true });