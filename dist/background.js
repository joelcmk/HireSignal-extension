// Background service worker for HireSignal extension
// This file is required by the manifest but currently has no active functionality

chrome.runtime.onInstalled.addListener(() => {
  console.log('HireSignal extension installed');
});
