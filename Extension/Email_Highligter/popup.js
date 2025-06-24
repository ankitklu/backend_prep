/* global chrome */
let lastExtractedEntry = null;

// === BUTTON WIRES =====================================================

document.getElementById("extractBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractEmailDetails
    })
  })
})

document.getElementById("downloadBtn").addEventListener("click", () => {
  chrome.storage.local.get({ entries: [] }, ({ entries }) => {
    if (!entries.length) return alert("Nothing to download yet ✋🏽")

    const headers = Object.keys(entries[0])
    const csv = [
      headers.join(","),
      ...entries.map((e) => headers.map((h) => `"${(e[h] || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement("a"), { href: url, download: "ngo-emails.csv" })
    document.body.append(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  })
})

document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.storage.local.clear(() => alert("Local store cleared."))
})

// === MESSAGE HANDLER ==================================================

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "EMAIL_DETAILS") return

  const { data } = msg
  lastExtractedEntry = data
  renderDetails(data)

  // send to Groq for deeper extraction / summary
  const plainText = Object.values(data).join("\n")
  analyzeWithGroq(plainText).then((json) => {
    const out = typeof json === "object" ? JSON.stringify(json, null, 2) : json
    appendDetail("Groq Summary", `<pre>${out}</pre>`)
    // Persist (lazy‑append so user can hit Download later)
    chrome.storage.local.get({ entries: [] }, ({ entries }) => {
      entries.push(json)
      chrome.storage.local.set({ entries })
    })
  })
})

// === DISPLAY HELPERS ==================================================
function renderDetails(obj) {
  const box = document.getElementById("details")
  box.innerHTML = "" // flush

  const order = ["Name", "Sender Email", "Date", "Transaction ID", "Amount", "Reason", "Type"]
  order.forEach((k) => obj[k] && appendDetail(k, obj[k]))
}

function appendDetail(label, value) {
  const row = document.createElement("div")
  row.className = "row"
  row.innerHTML = `<span class="lbl">${label}</span><span class="val">${value}</span>`
  document.getElementById("details").appendChild(row)
}

// === CONTENT‐SCRIPT INJECTION FUNCTION ===============================
function extractEmailDetails() {
  // This runs **inside Gmail tab** 📨
  const bodyEl = document.querySelector(".a3s")
  if (!bodyEl) return chrome.runtime.sendMessage({ type: "EMAIL_DETAILS", data: { Error: "Body not found" } })
  const txt = bodyEl.innerText

  const grab = (regex) => (txt.match(regex) || [])[0] || "" // 1st hit or blank

  const data = {
    "Name": grab(/(?:Mr\.|Ms\.|Mrs\.|Dr\.)?\s?[A-Z][a-z]+\s[A-Z][a-z]+/),
    "Sender Email": grab(/[\w.-]+@[\w.-]+\.[\w]+/),
    "Date": grab(/\b\d{1,2}[\-/ ]?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?[\-/ ]?\d{2,4}\b/i),
    "Transaction ID": grab(/(?:TXN|TRX|ID)[\s:-]?[A-Z0-9]{6,}/i),
    "Amount": grab(/₹\s?\d{1,3}(,\d{3})*(\.\d{2})?/),
    "Reason": grab(/(?:Purpose|Reason|Subject|Regarding)[:\- ]+([A-Za-z ]{3,})/i),
    "Full Email": txt
  }

  // Categorise
  const lower = txt.toLowerCase()
  if (/(donat|contribut|fund|charity)/.test(lower)) data.Type = "Donation"
  else if (/(complaint|issue|problem|refund)/.test(lower)) data.Type = "Complaint/Issue"
  else data.Type = "General"

  chrome.runtime.sendMessage({ type: "EMAIL_DETAILS", data })
}

// === GROQ API =========================================================
async function analyzeWithGroq(text) {
  const GROQ_API_KEY = "api-key" // put in environment or storage

  if (GROQ_API_KEY.startsWith("<")) return { Note: "Set GROQ_API_KEY first" }

  const prompt = `You are an email‑analysis assistant for an NGO.\nExtract Sender Name, Sender Email, Date, Transaction Amount, Transaction ID, Purpose, and classify the email as Donation or Complaint.`

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      temperature: 0,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text }
      ]
    })
  })

  const json = await res.json().catch(() => ({}))
  try {
    return JSON.parse(json.choices?.[0]?.message?.content)
  } catch {
    return { Raw: json.choices?.[0]?.message?.content || "No response" }
  }
}