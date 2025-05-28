// src/content.ts
console.log("Content script injected!")

chrome.runtime.sendMessage({ from: "content", data: "Hello background!" }, (response) => {
  console.log("Received from background:", response)
})
