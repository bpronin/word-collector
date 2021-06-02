importScripts("messages.js", "settings.js", "google-sheets.js")

const CONTEXT_MENU_ID = "WORDS_COLLECTOR_CONTEXT_MENU"

let currentSpreadsheet = {
    id: undefined,
    sheet: undefined
}

function loadSettings() {
    settings.getSpreadsheet(data => {
        currentSpreadsheet = {
            id: data[KEY_SHEET_ID],
            sheet: data[KEY_SHEET_SHEET]
        }
    })
}

function saveSettings() {
    settings.setSpreadsheet({
        [KEY_SHEET_ID]: currentSpreadsheet.id,
        [KEY_SHEET_SHEET]: currentSpreadsheet.sheet
    })
}

function getData() {
    gapi.spreadsheets.getValues(currentSpreadsheet, (data) => {
        sendMessage(ACTION_DATA_CHANGED, data)
    })
}

function getSpreadsheetInfo() {
    gapi.spreadsheets.getSpreadsheet(currentSpreadsheet, (data) => {
        sendMessage(ACTION_SPREADSHEET_INFO_CHANGED, data)
    })
}

function getCurrentSpreadsheet() {
    sendMessage(ACTION_CURRENT_SPREADSHEET_CHANGED, currentSpreadsheet)
}

function setCurrentSpreadsheet(spreadsheet) {
    currentSpreadsheet = spreadsheet
    saveSettings()
    sendMessage(ACTION_CURRENT_SPREADSHEET_CHANGED, currentSpreadsheet)
}

function onLoginStateChanged(signedIn) {
    sendMessage(ACTION_LOGIN_STATE_CHANGED, signedIn)
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
        gapi.spreadsheets.appendValue(currentSpreadsheet, info.selectionText)

        console.log("Saved: '" + info.selectionText + "'");
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_GET_LOGIN_STATE:
                gapi.authenticate(false)
                break
            case ACTION_LOGIN:
                gapi.signIn()
                break
            case ACTION_LOGOUT:
                gapi.signOut()
                break
            case ACTION_GET_DATA:
                getData();
                break
            case ACTION_GET_SPREADSHEET_INFO:
                getSpreadsheetInfo()
                break
            case ACTION_GET_CURRENT_SPREADSHEET:
                getCurrentSpreadsheet()
                break
            case ACTION_SET_CURRENT_SPREADSHEET:
                setCurrentSpreadsheet(request.data)
                break
            default:
                throw ("unknown action: " + request.action)
        }
        sendResponse()
    }
)

gapi.setup(onLoginStateChanged)
loadSettings()

console.log("Installed")
