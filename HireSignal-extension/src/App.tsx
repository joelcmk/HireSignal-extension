// import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const onClick = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab) {
        console.error('No active tab found');
        return;
      }
      console.log('Executing script in tab:', tab.id);
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id! },
          func: () => {
            console.log('Script executed in tab');
            document.body.style.backgroundColor = 'red';
          },
        },
        (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error executing script:', chrome.runtime.lastError);
          } else {
            console.log('Script execution result:', result);
          }
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => onClick()}>count is </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
