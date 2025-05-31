// import { useState } from 'react';
import hireAlertLogo from '/icon.png';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Switch from './switch';

function App() {
  const [showSponsoredPosts, setShowSponsoredPosts] = useState(false);
  const [sortPostsByDate, setSortPostsByDate] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [location, setLocation] = useState(null);

  const handleToggle = () => {
    setShowSponsoredPosts(!showSponsoredPosts);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: 'toggleSponsoredPosts',
            showSponsoredPosts: showSponsoredPosts,
          },
          function (response) {
            setJobTitle(response.jobTitle);
            setLocation(response.location);
            console.log('Received response from content script:', response);
          }
        );
      } else {
        console.error('No active tab found' + error);
      }
    });
    // setShowSponsoredPosts(!showSponsoredPosts);
    console.log('hello tg');
  };

  const handleSortToggle = () => {
    setSortPostsByDate(!sortPostsByDate);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: 'toggleSortedPosts',
            showSponsoredPosts: !showSponsoredPosts,
          },
          function (response) {
            setJobTitle(response.jobTitle);
            setLocation(response.location);
            console.log('Received response from content script:', response);
          }
        );
      } else {
        console.error('No active tab found' + error);
      }
    });
  };

  console.log(handleSortToggle);

  function query(jobTitle: string | null, location: string | null): void {
    if (jobTitle === null) {
      console.error('Job title is null');
      return;
    }
    if (location === null) {
      console.error('Job title is null');
      return;
    }
    const newJobTitle = jobTitle.replace(/ /g, '%20');
    const newLocation = location.split(' ');

    console.log(newJobTitle);
    console.log(newLocation);
  }

  console.log('jobTitle ', jobTitle);
  console.log('location ', location);

  query(jobTitle, location);

  useEffect(() => {
    axios
      .get(
        'https://hiresignal-server.vercel.app/search?keyword=javascript&location=chicago'
      )
      .then((response) => {
        setData(response.data);
        // console.log(response);
      })
      .catch((error) => {
        setError(error.message);
        // console.error(error);
      });
  }, []);

  console.log(data);

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
            {/* <div className="toggle">
              <span>Advanced mode</span>
              <Switch
                isOn={sortPostsByDate}
                handleToggle={handleSortToggle}
                id="sort-posts-switch"
              />
            </div> */}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
