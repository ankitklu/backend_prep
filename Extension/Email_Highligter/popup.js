let lastExtractedEntry = null;

document.getElementById("extractBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: extractEmailDetails
    });
  });
});

document.getElementById("updateBtn").addEventListener("click", () => {
  if (!lastExtractedEntry) {
    alert("Please extract details first.");
    return;
  }

  chrome.storage.local.get({ entries: [] }, (result) => {
    const updatedEntries = result.entries;
    updatedEntries.push(lastExtractedEntry);
    chrome.storage.local.set({ entries: updatedEntries }, () => {
      alert("Data updated to store.csv (in-memory)");
    });
  });
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  chrome.storage.local.get({ entries: [] }, (result) => {
    const entries = result.entries;
    if (entries.length === 0) {
      alert("No data to download.");
      return;
    }

    const headers = Object.keys(entries[0]);
    const csvRows = [
      headers.join(","),
      ...entries.map(e =>
        headers.map(h => `"${(e[h] || "").replace(/"/g, '""')}"`).join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "store.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "EMAIL_DETAILS") {
    const container = document.getElementById("details");
    container.innerHTML = "";
    lastExtractedEntry = request.data;

    for (const [key, value] of Object.entries(request.data)) {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${key}:</strong> ${value}`;
      container.appendChild(div);
    }
  }
});

function extractEmailDetails() {
  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : "Not found";
  };

  const senderInfo = getText("h3.iw span[email]") || getText(".gD");
  const senderEmail = getText("span[email]") || "Not found";
  const date = getText(".g3");
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

  chrome.runtime.sendMessage({ type: "EMAIL_DETAILS", data: result });
}
