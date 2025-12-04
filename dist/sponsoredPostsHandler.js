// Function to find all sponsored posts
function getSponsoredPosts() {
  const sponsoredPosts = [];
  const jobCards = document.querySelectorAll('div[data-view-name="job-search-job-card"]')
  console.log('HireSignal: Found job cards:', jobCards.length);
  
  jobCards.forEach((jobCard) => {
    const textContent = jobCard.innerText || jobCard.textContent || '';
    
    // Check for various promoted/sponsored indicators
    const isPromoted = textContent.includes('Promoted by hirer') ||
                      textContent.includes('Promoted') ||
                      textContent.includes('Sponsored') ||
                      textContent.includes('Advertisement') ||
                      /\bAd\b/i.test(textContent);
    
    if (isPromoted) {
      console.log('HireSignal: Found sponsored post:', jobCard);
      // Find the container that should be removed
      // LinkedIn wraps job cards in <li> elements, find the closest one
      const container = jobCard.closest('li') || jobCard.parentElement;
      if (container) {
        console.log('HireSignal: Found container to remove:', container);
        sponsoredPosts.push(container);
      } else {
        console.warn('HireSignal: Could not find container for sponsored post');
      }
    }
  });
  
  return sponsoredPosts;
}

// Function to remove sponsored posts from the DOM
function removeSponsoredPosts(showSponsoredPosts) {
  if (showSponsoredPosts) {
    // Don't remove if user wants to see sponsored posts
    return;
  }

  const sponsoredPosts = getSponsoredPosts();
  console.log('HireSignal: Removing', sponsoredPosts.length, 'sponsored posts');
  
  if (sponsoredPosts.length > 0) {
    // Update the total removed count in Chrome storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['totalRemovedCount'], (result) => {
        const currentCount = result.totalRemovedCount || 0;
        const newCount = currentCount + sponsoredPosts.length;
        
        chrome.storage.sync.set({ totalRemovedCount: newCount }, () => {
          if (!chrome.runtime.lastError) {
            console.log('HireSignal: Updated total removed count to:', newCount);
          }
        });
      });
    }
  }
  
  sponsoredPosts.forEach((container) => {
    
    // The <hr> is a sibling of the parent container, not this container
    const parentNextSibling = container.parentElement?.nextElementSibling;
    if (parentNextSibling && parentNextSibling.tagName === 'HR') {
      parentNextSibling.remove();
    }
    
    container.remove();
  });
}
