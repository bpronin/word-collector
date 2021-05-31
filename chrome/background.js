importScripts("util.js", "settings.js", "google-sheets.js")

const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU";

function onStateChanged(signedIn) {
    chrome.runtime.sendMessage({
        action: "state_changed",
        signedIn: signedIn
    })
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: "Save selection: %s",
        contexts: ["selection"]
    });
})

chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        sheets.append(info.selectionText)

        console.log("Saved: '" + info.selectionText + "'");
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case "get_state":
                sheets.authenticate(false)
                sendResponse()
                break
            case "sign_in":
                sheets.signIn()
                sendResponse()
                break
            case "sign_out":
                sheets.signOut()
                sendResponse()
                break
            case "get_data":
                sheets.values((data) => {
                    chrome.runtime.sendMessage({
                        action: "data_received",
                        data: data
                    })
                })
                sendResponse()
                break
            default:
                throw ("unknown action: " + request.action)
        }
    }
)

sheets.setup(onStateChanged)

settings.getSheet(sheet => {
    sheets.sheet = sheet
})

console.log("Installed")
