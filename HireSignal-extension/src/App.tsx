// import { useState } from 'react';
import hireAlertLogo from '/icon.png';
import './App.css';
import { useState } from 'react';

function App() {
  const [showSponsoredPosts, setShowSponsoredPosts] = useState(true);

  const handleToggle = () => {
    setShowSponsoredPosts(!showSponsoredPosts);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleSponsoredPosts',
          showSponsoredPosts: !showSponsoredPosts,
        });
      } else {
        console.error('No active tab found');
      }
    });
  };

  return (
    <>
      <div>
        <a href="https://hire-signal.vercel.app/" target="_blank">
          <img src={hireAlertLogo} className="logo" alt="HireSignal logo" />
        </a>
      </div>
      <h1>HireSignal</h1>
      <div className="card">
        <div>
          <label>
            <input
              type="checkbox"
              checked={showSponsoredPosts}
              onChange={handleToggle}
            />
            Show Sponsored Posts
          </label>
        </div>
      </div>
    </>
  );
}

export default App;
