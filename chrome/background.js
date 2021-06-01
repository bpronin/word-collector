importScripts("util.js", "settings.js", "google-sheets.js")

const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU"

let currentSpreadsheet = undefined

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
        sheets.appendValue(currentSpreadsheet, info.selectionText)

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
                sheets.getValues(currentSpreadsheet, (data) => {
                    chrome.runtime.sendMessage({
                        action: "data_received",
                        data: data
                    })
                })
                sendResponse()
                break
            case "get_spreadsheet":
                sheets.getSpreadsheet(currentSpreadsheet, (data) => {
                    chrome.runtime.sendMessage({
                        action: "spreadsheet_received",
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

settings.getSpreadsheet(spreadsheet => {
    currentSpreadsheet = spreadsheet
})

console.log("Installed")
