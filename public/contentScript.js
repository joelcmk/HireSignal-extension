(function() {
  'use strict';
  
  let showSponsoredPosts = false;

  // Load settings from storage first
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(['showSponsoredPosts'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('HireSignal: Error loading settings:', chrome.runtime.lastError);
        return;
      }
      if (result.showSponsoredPosts !== undefined) {
        showSponsoredPosts = result.showSponsoredPosts;
      }
      console.log('HireSignal: Loaded showSponsoredPosts from storage:', showSponsoredPosts);

      // Call removeSponsoredPosts immediately after loading settings
      removeSponsoredPosts(showSponsoredPosts);

      // Start the MutationObserver after settings are loaded
      const observer = new MutationObserver(() => {
        removeSponsoredPosts(showSponsoredPosts);
      });

      observer.observe(document.body, { childList: true, subtree: true });
      console.log('HireSignal: MutationObserver started');
    });
  }

  // Listen for messages from popup to update settings
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateSettings') {
        showSponsoredPosts = request.showSponsoredPosts;
        
        // Save to storage
        chrome.storage.sync.set({ showSponsoredPosts: showSponsoredPosts }, () => {
          if (!chrome.runtime.lastError) {
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