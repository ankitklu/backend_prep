// Function to highlight patterns
function highlightEmailContent() {
  const body = document.querySelector("div[role='listitem'], div.a3s");
  if (!body) return;

  const patterns = [
    { label: "Amount", regex: /₹\s?\d{1,3}(,\d{3})*(\.\d{2})?/g },
    { label: "Date", regex: /\b(?:\d{1,2}[\-/ ]?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?[\-/ ]?\d{2,4})\b/gi },
    { label: "Transaction ID", regex: /(?:TXN|TRX|ID)[\s:-]?[A-Z0-9]{6,}/g },
    { label: "Email", regex: /[\w\.-]+@[\w\.-]+\.\w+/g },
    { label: "Name", regex: /\b(?:Mr\.|Ms\.|Mrs\.|Dr\.)?\s?[A-Z][a-z]+\s[A-Z][a-z]+\b/g }
  ];

  patterns.forEach(({ label, regex }) => {
    body.innerHTML = body.innerHTML.replace(regex, (match) => {
      return `<span class="highlighted" title="${label}">${match}</span>`;
    });
  });
}

// Create and inject floating button
function injectHighlightButton() {
  if (document.getElementById("highlight-btn")) return;

  const btn = document.createElement("button");
  btn.id = "highlight-btn";
  btn.innerText = "🔍 Highlight Info";
  btn.className = "floating-highlight-btn";
  btn.onclick = highlightEmailContent;

  document.body.appendChild(btn);
}

// Watch for email content and inject button when needed
const observer = new MutationObserver(() => {
  injectHighlightButton();
});
observer.observe(document.body, { childList: true, subtree: true });
