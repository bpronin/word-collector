function noop() {
    /* placeholder function. does nothing */
}

function chromeOpenTab(url) {
    chrome.tabs.query({url: url}, tabs => {
        const tab = tabs[0]
        if (tab) {
            chrome.tabs.update(tab.id, {highlighted: true})
        } else {
            chrome.tabs.create({url: url})
        }
    })
}