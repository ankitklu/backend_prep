// src/background.ts
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed")
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received:", message)
  sendResponse({ reply: "Hello from background!" })
})
