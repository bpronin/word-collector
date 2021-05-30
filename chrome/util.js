function noop() {
    /* placeholder function. does nothing */
}

// function encodeURIQuery(obj) {
//     return Object
//         .keys(obj)
//         .map(key => key + "=" + encodeURIComponent(obj[key]))
//         .join("&")
// }

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