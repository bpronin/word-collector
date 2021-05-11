const HISTORY_PAGE_URL = chrome.runtime.getURL("history.html")
const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

function selectTab(tab) {
    chrome.tabs.update(tab.id, {highlighted: true})
}

function openTab(url) {
    chrome.tabs.query({url: url}, tabs => {
        const tab = tabs[0]
        if (tab) {
            selectTab(tab)
        } else {
            chrome.tabs.create({url: url})
        }
    })
}

let historyButton = document.getElementById("history_button");
let optionsButton = document.getElementById("options_button");

historyButton.addEventListener("click", async () => openTab(HISTORY_PAGE_URL))
optionsButton.addEventListener("click", async () => openTab(OPTIONS_PAGE_URL))
