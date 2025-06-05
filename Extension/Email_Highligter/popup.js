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

    const displayEntry = (data) => {
      for (const [key, value] of Object.entries(data)) {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${key}:</strong> ${value}`;
        container.appendChild(div);
      }
    };

    displayEntry(request.data);

    // 🔍 Analyze with GroqCloud
    const fullText = Object.values(request.data).join("\n");
    analyzeWithGroq(fullText).then((summary) => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>Groq Summary:</strong> <pre>${typeof summary === "object" ? JSON.stringify(summary, null, 2) : summary}</pre>`;
      container.appendChild(div);
    });
  }
});

function extractEmailDetails() {
  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : "Not found";
  };

  const emailBody = document.querySelector(".a3s")?.innerText || "No content found";

  const result = {
    "Full Email": emailBody
  };

  chrome.runtime.sendMessage({ type: "EMAIL_DETAILS", data: result });
}


async function analyzeWithGroq(emailText) {
  const GROQ_API_KEY = "<groq_api_key>";

  const prompt = `
You are an information extraction assistant.
Given an email message, extract the following fields and return them as a JSON object:

- Sender Name
- Sender Email
- Date
- Transaction Amount
- Transaction ID
- Purpose of Transaction

Email:
"""${emailText}"""
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You extract structured data from email content." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  const data = await response.json();

  try {
    // Try to parse JSON from the assistant's reply
    const json = JSON.parse(data.choices?.[0]?.message?.content);
    return json;
  } catch (e) {
    return {
      Error: "Groq could not return structured JSON. Response was:",
      Raw: data.choices?.[0]?.message?.content || "No response"
    };
  }
}



