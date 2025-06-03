
// runs inside the webpage DOM

function getArticleText(){
    const email= document.querySelector("article");
    if(email){
        return email.innerText;
    }
    const content= Array.from(document.querySelectorAll("p"));
    return content.map(element => element.innerText).join("\n");
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse)=>{
    if((req.type = "GET_ARTICLE_TEXT")) {
        const text = getArticleText();
        sendResponse({ text });
    }
});
