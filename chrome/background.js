importScripts("util.js", "settings.js", "google-sheets.js")

const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU";
const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

function sendMessage(data) {
    chrome.tabs.query({url: OPTIONS_PAGE_URL}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, data, response => {
            console.log("Message response: " + response)
        });
    });
}

chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Save selection: %s",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        console.log("Saving: '" + info.selectionText + "'");

        sheets.append(info.selectionText)
    }
})

chrome.runtime.onInstalled.addListener(() => {

    function onStateChanged(signedIn) {
        sendMessage({
            action: "state_changed",
            signedIn: signedIn
        });
    }

    settings.getSheet(sheet => {
        sheets.sheet = sheet
        sheets.setup(onStateChanged)
    })

    console.log("Installed")
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case "get_state":
                sheets.authenticate(false)
                sendResponse("ok")
                break
            case "sign_in":
                sheets.signIn()
                sendResponse("ok")
                break
            case "sign_out":
                sheets.signOut()
                sendResponse("ok")
                break
            case "get_data":
                sheets.values((data) => {
                    sendMessage({
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
);