const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

let optionsButton = document.getElementById("options_button");

optionsButton.addEventListener("click", async () => {

    chrome.tabs.query({url: OPTIONS_PAGE_URL}, tabs => {
        let tab = tabs[0]
        if (tab) {
            chrome.tabs.update(tab.id, {highlighted: true})
        } else {
            chrome.tabs.create({url: OPTIONS_PAGE_URL})
        }
    })

})
