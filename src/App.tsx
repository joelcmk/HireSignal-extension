import hireAlertLogo from '/icon.png';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Switch from './switch';

function App() {
  const [showSponsoredPosts, setShowSponsoredPosts] = useState(true);
  const [sortPostsByDate, setSortPostsByDate] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [location, setLocation] = useState(null);

  const sendMessageToContentScript = (action: string, payload = {}) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action, ...payload },
          function (response) {
            if (chrome.runtime.lastError) {
              console.error(
                'Error sending message:',
                chrome.runtime.lastError.message
              );

              return;
            }
            if (response) {
              setJobTitle(response.jobTitle);
              setLocation(response.location);
              if (response.jobTitle && response.location) {
                query(response.jobTitle, response.location);
              }
              console.log('Received response from content script:', response);
            } else {
              console.warn(
                'Content script sent an empty or undefined response.'
              );
            }
          }
        );
      } else {
        console.error('No active tab found.');
      }
    });
  };

  const handleToggle = () => {
    const newShowSponsoredPosts = !showSponsoredPosts;
    setShowSponsoredPosts(newShowSponsoredPosts);
    sendMessageToContentScript('toggleSponsoredPosts', {
      showSponsoredPosts: newShowSponsoredPosts,
    });
  };

  const handleSortToggle = () => {
    const newSortPostsByDate = !sortPostsByDate;
    setSortPostsByDate(newSortPostsByDate);
    sendMessageToContentScript('toggleSortedPosts', {
      sortPostsByDate: newSortPostsByDate,
    });
  };

  function query(
    jobTitleParam: string | null,
    locationParam: string | null
  ): void {
    if (!jobTitleParam || !locationParam) {
      console.warn('Job title or location is null, cannot perform query.');
      return;
    }

    const newJobTitle = encodeURIComponent(jobTitleParam);
    const newLocation = encodeURIComponent(locationParam);

    console.log('Querying with:', newJobTitle, newLocation);

    axios
      .get(
        `https://hiresignal-server.vercel.app/search?keyword=${newJobTitle}&location=${newLocation}`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err.message);
        console.error('API query error:', err);
      });
  }

  // console.log(query('javascript', 'dallas'));

  useEffect(() => {
    try {
      sendMessageToContentScript('getInitialData');
    } catch (e) {
      console.error('Error in useEffect (initial data fetch):', e);
    }
  }, []);

  console.log('Current jobTitle state:', jobTitle);
  console.log('Current location state:', location);
  console.log('API data:', data);
  console.log('API error:', error);

  return (
    <>
      <header>
        <a
          href="https://hire-signal.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={hireAlertLogo} className="logo" alt="HireSignal logo" />
        </a>
        <h1>HireSignal</h1>
      </header>
      <div className="card">
        <section>
          <h2>Preferences</h2>
          <div className="toggles">
            <div className="toggle">
              <span> Show Sponsored Posts</span>
              <Switch
                isOn={showSponsoredPosts}
                onClick={handleToggle}
                id="sponsored-posts-switch"
              />
            </div>
            <div className="toggle">
              <span>Advanced mode</span>
              <Switch
                isOn={sortPostsByDate}
                onClick={handleSortToggle}
                id="sort-posts-switch"
              />
            </div>
          </div>
          {/* Display job title and location for debugging/user info */}
          <div>
            <p>Job Title: {jobTitle || 'Not found'}</p>
            <p>Location: {location || 'Not found'}</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
