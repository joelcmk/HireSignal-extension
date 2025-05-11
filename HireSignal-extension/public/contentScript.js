let showSponsoredPosts = true;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleSponsoredPosts') {
    showSponsoredPosts = request.showSponsoredPosts;
    if (!showSponsoredPosts) {
      removeSponsoredJobs();
    }
  }
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

const observer = new MutationObserver(() => {
  if (!showSponsoredPosts) {
    removeSponsoredJobs();
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
