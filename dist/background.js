// Background script to intercept LinkedIn CSRF token and fetch job data
// This runs as a service worker and has access to chrome.webRequest API

console.log('HireSignal: Background script loaded');

let csrfToken = null;
let tokenLastUpdated = 0;

// Intercept LinkedIn API requests to extract CSRF token
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const headers = details.requestHeaders;
    const expired = !csrfToken || Date.now() - tokenLastUpdated > 32000; // 32 seconds
    
    if (expired && headers) {
      // Look for csrf-token header
      const csrfHeader = headers.find(header => header.name.toLowerCase() === 'csrf-token');
      
      if (csrfHeader && csrfHeader.value) {
        csrfToken = csrfHeader.value;
        tokenLastUpdated = Date.now();
        console.log('HireSignal: 🔑 CSRF token captured:', csrfToken.substring(0, 20) + '...');
      }
    }
  },
  {
    urls: ["https://www.linkedin.com/voyager/api/*"]
  },
  ["requestHeaders", "extraHeaders"]
);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobData') {
    const jobId = request.jobId;
    
    if (!csrfToken) {
      sendResponse({ error: 'No CSRF token available yet. Please refresh the page.' });
      return true;
    }
    
    console.log('HireSignal: Fetching job data for ID:', jobId);
    
    // Fetch job data from LinkedIn API
    fetchJobData(jobId)
      .then(data => {
        console.log('HireSignal: ✅ Job data fetched:', data);
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        console.error('HireSignal: ❌ Error fetching job data:', error);
        sendResponse({ error: error.message });
      });
    
    return true; // Keep the message channel open for async response
  }
});

// Fetch job data from LinkedIn's GraphQL API
async function fetchJobData(jobId) {
  // LinkedIn's API doesn't have a single-job endpoint with applicant counts
  // We need to search for the job in the job search results
  // Use a search query that will return this specific job
  const url = `https://www.linkedin.com/voyager/api/graphql?variables=(count:1,query:(origin:JOB_SEARCH_PAGE_QUERY_EXPANSION,keywords:,selectedFilters:(id:List(${jobId}))),start:0)&queryId=voyagerJobsDashJobCards.a18f4e75c4ec13a6acae19909e362b3b`;
  
  console.log('HireSignal: API URL:', url);
  
  const headers = {
    "accept": "application/vnd.linkedin.normalized+json+2.1",
    "accept-language": "en-US,en;q=0.9",
    "csrf-token": csrfToken,
    "x-li-lang": "en_US",
    "x-restli-protocol-version": "2.0.0",
    "x-li-page-instance": "urn:li:page:d_flagship3_search_srp_jobs;" + Date.now()
  };
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('HireSignal: API Error Response:', errorText.substring(0, 500));
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('HireSignal: API Response:', data);
    
    // Parse the response to extract job details
    if (data.included && Array.isArray(data.included)) {
      const jobData = {};
      
      data.included.forEach(entry => {
        // Look for job posting data
        if (entry.entityUrn && entry.entityUrn.includes('jobPosting')) {
          console.log('HireSignal: Found job posting entry:', entry);
          
          // Extract title
          if (entry.title?.text) {
            jobData.title = entry.title.text;
          }
          
          // Extract company
          if (entry.primaryDescription?.text) {
            jobData.company = entry.primaryDescription.text.split('·')[0]?.trim();
          }
          
          // Extract applicant count from footerItems
          if (entry.footerItems && Array.isArray(entry.footerItems)) {
            console.log('HireSignal: Checking footerItems:', entry.footerItems);
            
            entry.footerItems.forEach(item => {
              if (item.type === 'APPLICANT_COUNT_TEXT') {
                const applicantText = item?.text?.text;
                if (applicantText) {
                  jobData.applicantCount = applicantText;
                  console.log('HireSignal: 🎯 Found applicant count:', applicantText);
                  
                  // Extract number
                  const firstWord = applicantText.split(' ')[0];
                  if (firstWord.toLowerCase() === 'be') {
                    jobData.applicantCountNumber = 25;
                  } else {
                    const num = parseInt(firstWord.replace(/,/g, ''));
                    if (!isNaN(num)) {
                      jobData.applicantCountNumber = num;
                    }
                  }
                }
              }
              
              if (item.type === 'LISTED_DATE') {
                jobData.listingDate = item.timeAt;
              }
            });
          }
          
          // Extract job insights
          if (entry.jobInsightsV2ResolutionResults) {
            entry.jobInsightsV2ResolutionResults.forEach(item => {
              const itemText = item.insightViewModel?.text?.text;
              if (itemText === 'Easy Apply') {
                jobData.isEasyApply = true;
              }
            });
          }
        }
      });
      
      if (Object.keys(jobData).length > 0) {
        return jobData;
      }
    }
    
    throw new Error('No job data found in response');
  } catch (error) {
    console.error('Error fetching job data:', error);
    throw error;
  }
}
