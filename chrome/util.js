const URL_GOOGLE_SPREADSHEETS = "https://docs.google.com/spreadsheets/d/"

function $(componentId) {
    return document.getElementById(componentId)
}

function setVisible(component, visible) {
    component.style.display = visible ? "block" : "none"
}

function openUniqueTab(url) {
    chrome.tabs.query({url: url + "*"}, tabs => {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, {highlighted: true})
        } else {
            chrome.tabs.create({url: url})
        }
    })
}