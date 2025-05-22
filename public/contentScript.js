let showSponsoredPosts = true;
let sortPostsByDate = true;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleSponsoredPosts') {
    showSponsoredPosts = request.showSponsoredPosts;
    if (!showSponsoredPosts) {
      removeSponsoredJobs();
    }
  } else if (request.action === 'toggleSortedPosts') {
    sortPostsByDate = request.sortPostsByDate;
    // Implement sorting logic here if needed
  }

  sendResponse({
    jobTitle: getJobTitle(),
    location: getLocation(),
  });
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
  const jobTitleBox = document.querySelector('.jobs-search-box__text-input');
  const triggerValue = jobTitleBox.getAttribute(
    'data-job-search-box-keywords-input-trigger'
  );
  return triggerValue;
}

function getLocation() {
  const locationInput = document.getElementById(
    'jobs-search-box-location-id-ember33'
  );
  const locationValue = locationInput.value;
  return locationValue;
}

function query(jobTitle, location) {}

const observer = new MutationObserver(() => {
  if (!showSponsoredPosts) {
    removeSponsoredJobs();
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
