let showSponsoredPosts = true;
let sortPostsByDate = true;

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.action === 'toggleSponsoredPosts') {
    showSponsoredPosts = request.showSponsoredPosts;
    if (!showSponsoredPosts) {
      removeSponsoredJobs();
    }
  } else if (request.action === 'toggleSortedPosts') {
    sortPostsByDate = request.sortPostsByDate;
    // Implement sorting logic here if needed
  }

  const jobTitle = getJobTitle(); // Changed to sync as it reads from DOM directly
  const location = getLocation(); // Changed to sync as it reads from DOM directly

  const response = {
    jobTitle,
    location,
  };
  sendResponse(response);
  return true; // Keep the messaging port open
});

function removeSponsoredJobs() {
  const sponsoredJobs = Array.from(
    document.querySelectorAll('div.job-card-container')
  ).filter((job) => {
    const promotedSpan = job.querySelector(
      'li.job-card-container__footer-item span'
    );
    return (
      promotedSpan &&
      promotedSpan.textContent &&
      promotedSpan.textContent.includes('Promoted')
    );
  });
  sponsoredJobs.forEach((job) => {
    job.remove();
  });
}

function getJobTitle() {
  const jobTitleInput = document.querySelector(
    'input.jobs-search-box__text-input.jobs-search-box__keyboard-text-input'
  );

  if (jobTitleInput) {
    return jobTitleInput.value;
  } else {
    console.warn('Job title input not found.');
    return null;
  }
}

function getLocation() {
  const locationInput = document.querySelector(
    'input[aria-label="City, state, or zip code"]'
  );

  if (locationInput) {
    return locationInput.value; // <--- Access the 'value' property to get the text
  } else {
    console.warn('Location input not found.');
    return null;
  }
}

const observer = new MutationObserver(() => {
  if (!showSponsoredPosts) {
    removeSponsoredJobs();
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
