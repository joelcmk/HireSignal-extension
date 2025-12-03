(function() {
  'use strict';
  
  let showSponsoredPosts = false;

  const observer = new MutationObserver(() => {
    removeSponsoredPosts(showSponsoredPosts);
  });

  // Load initial settings from storage FIRST, then start observing
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(['showSponsoredPosts'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('HireSignal: Error loading settings:', chrome.runtime.lastError);
        return;
      }
      
      if (result.showSponsoredPosts !== undefined) {
        showSponsoredPosts = result.showSponsoredPosts;
        console.log('HireSignal: Loaded showSponsoredPosts from storage:', showSponsoredPosts);
      }
      
      // Now that we have the correct setting, remove any existing sponsored posts
      removeSponsoredPosts(showSponsoredPosts);
      
      // Start observing for future changes
      observer.observe(document.body, { childList: true, subtree: true });
      console.log('HireSignal: MutationObserver started');
    });
  } else {
    // If chrome.storage is not available, start observing anyway with default value
    removeSponsoredPosts(showSponsoredPosts);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Listen for messages from popup to update settings
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateSettings') {
        showSponsoredPosts = request.showSponsoredPosts;
        console.log('HireSignal: Updated showSponsoredPosts to:', showSponsoredPosts);
        
        // Save to storage
        chrome.storage.sync.set({ showSponsoredPosts: showSponsoredPosts }, () => {
          if (!chrome.runtime.lastError) {
            console.log('HireSignal: Saved showSponsoredPosts to storage');
            // Reload the page to apply the new settings
            if(showSponsoredPosts) {
              window.location.reload();
            } else {
              // If turning off sponsored posts, remove them immediately
              removeSponsoredPosts(showSponsoredPosts);
            }
          }
        });
        
        sendResponse({ success: true });
      }
    });
  }
})();