document.getElementById("extractBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: extractEmailDetails
    });
  });
});

function extractEmailDetails() {
  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : "Not found";
  };

  // These are selectors based on Gmail's DOM — subject to change
  const senderInfo = getText("h3.iw span[email]") || getText(".gD");
  const senderEmail = getText("span[email]") || "Not found";
  const date = getText(".g3");

  // Extract amount and transaction ID using regex
  const emailBody = document.querySelector(".a3s")?.innerText || "";
  const amount = emailBody.match(/\₹\s?[\d,]+(\.\d{2})?/i)?.[0] || "Not found";
  const txnId = emailBody.match(/(Txn|Transaction)[\s:]*[A-Z0-9-]+/i)?.[0] || "Not found";

  const result = {
    "Sender Name": senderInfo,
    "Sender Email": senderEmail,
    "Date": date,
    "Amount": amount,
    "Transaction ID": txnId
  };

  let output = "📬 Extracted Details:\n\n";
  for (const [key, val] of Object.entries(result)) {
    output += `${key}: ${val}\n`;
  }

  alert(output);
}
