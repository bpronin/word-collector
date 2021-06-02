importScripts("messages.js", "settings.js", "google-sheets.js")

const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU"

let spreadsheet = {
    id: undefined,
    sheet: undefined
}

function onLoginStateChanged(signedIn) {
    chrome.runtime.sendMessage({
        action: ACTION_LOGIN_STATE_CHANGED,
        signedIn: signedIn,
        spreadsheet: spreadsheet
    })
}

function getData() {
    sheets.getValues(spreadsheet, (data) => {
        chrome.runtime.sendMessage({
            action: ACTION_DATA_RECEIVED,
            data: data
        })
    })
}

function getSpreadsheet() {
    sheets.getSpreadsheet(spreadsheet, (data) => {
        chrome.runtime.sendMessage({
            action: ACTION_STREADSHEET_RECEIVED,
            data: data
        })
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
        sheets.appendValue(spreadsheet, info.selectionText)

        console.log("Saved: '" + info.selectionText + "'");
    }
})


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_GET_LOGIN_STATE:
                sheets.authenticate(false)
                break
            case ACTION_LOGIN:
                sheets.signIn()
                break
            case ACTION_LOGOUT:
                sheets.signOut()
                break
            case ACTION_GET_DATA:
                getData();
                break
            case ACTION_GET_SPREADSHEET:
                getSpreadsheet();
                break
            default:
                throw ("unknown action: " + request.action)
        }
        sendResponse()
    }
)


// settings.addListener((key, value) => {
//     if (key === KEY_SHEET_ID) {
//         spreadsheet.id = value
//     } else if (key === KEY_SHEET_SHEET) {
//         spreadsheet.sheet = value
//     }
// })

settings.getSpreadsheet(data => {
    spreadsheet = {
        id: data[KEY_SHEET_ID],
        sheet: data[KEY_SHEET_SHEET]
    }
})

sheets.setup(onLoginStateChanged)

console.log("Installed")
