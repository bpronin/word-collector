const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

const authSection = document.getElementById("auth_section");
const optionsSection = document.getElementById("options_section");
const settingsButton = document.getElementById("settings_button");
const signInButton = document.getElementById("sign_in_button");
const sheetEdit = document.getElementById("sheet_editor");
const rangeEdit = document.getElementById("range_editor");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case "state_changed":
                if (request.signedIn) {
                    authSection.style.display = "none"
                    optionsSection.style.display = "block"
                } else {
                    authSection.style.display = "block"
                    optionsSection.style.display = "none"
                }
                break;
        }
        sendResponse()
    }
)

settingsButton.addEventListener("click", () => {
    chrome.tabs.query({url: OPTIONS_PAGE_URL}, tabs => {
        const tab = tabs[0]
        if (tab) {
            chrome.tabs.update(tab.id, {highlighted: true})
        } else {
            chrome.tabs.create({url: OPTIONS_PAGE_URL})
        }
    })
})

signInButton.addEventListener("click", () => {
    return chrome.runtime.sendMessage({action: "sign_in"})
})

settings.getSheet(sheet => {
    sheetEdit.innerHTML = sheet.sheet_id
    rangeEdit.innerHTML = sheet.sheet_range
})

authSection.style.display = "none"
optionsSection.style.display = "none"

chrome.runtime.sendMessage({action: "get_state"})