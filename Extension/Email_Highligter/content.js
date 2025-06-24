/* Content script – runs inside Gmail */
function highlight() {
  const body = document.querySelector("div[role='listitem'], div.a3s")
  if (!body) return

  const groups = [
    { cls: "amt", re: /₹\s?\d{1,3}(,\d{3})*(\.\d{2})?/g },
    { cls: "date", re: /\b\d{1,2}[\-/ ]?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?[\-/ ]?\d{2,4}\b/gi },
    { cls: "tid", re: /(?:TXN|TRX|ID)[\s:-]?[A-Z0-9]{6,}/g },
    { cls: "email", re: /[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/g },
    { cls: "name", re: /(?:Mr\.|Ms\.|Mrs\.|Dr\.)?\s?[A-Z][a-z]+\s[A-Z][a-z]+/g },
    { cls: "reason", re: /(?:Purpose|Reason)[\s:-]+\s?[A-Za-z ]{3,}/gi }
  ]

  let html = body.innerHTML // ⚠️ using innerHTML – safe enough in Gmail context
  groups.forEach(({ cls, re }) => {
    html = html.replace(re, (m) => `<span class="hl ${cls}">${m}</span>`) // wrap & keep title implicit via CSS
  })

  // donation vs complaint colours
  if (/donat|contribut|fund|charity/i.test(body.innerText)) html = `<div class="donation">${html}</div>`
  else if (/complaint|issue|problem|refund/i.test(body.innerText)) html = `<div class="complaint">${html}</div>`

  body.innerHTML = html
}

// floating trigger btn
function injectBtn() {
  if (document.getElementById("ngo‑hl‑btn")) return
  const b = document.createElement("button")
  b.id = "ngo‑hl‑btn"
  b.textContent = "🔍 Highlight Info"
  b.className = "floating‑btn"
  b.addEventListener("click", highlight)
  document.body.append(b)
}

new MutationObserver(injectBtn).observe(document.body, { childList: true, subtree: true })