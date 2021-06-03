importScripts("messages.js", "settings.js", "google-api.js")

const CONTEXT_MENU_ID = "WORDS_COLLECTOR_CONTEXT_MENU"

let currentSpreadsheet

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

function ensureSpreadsheetExists(onComplete) {
    /* NOTE! Sheet will be found even if it is in trash! (todo: use Drve API to chect that fact)*/
    console.log("Checking spreadsheet: " + currentSpreadsheet.id)

    gapi.spreadsheets.getSpreadsheet(currentSpreadsheet, data => {
        if (data) {
            console.log("Existent spreadsheet: " + currentSpreadsheet.id)

            onComplete(data)
        } else {
            gapi.spreadsheets.createSpreadsheet(data => {
                console.log("New spreadsheet created:" + JSON.stringify(data))

                setCurrentSpreadsheet({
                    id: data.spreadsheetId,
                    sheet: data.sheets[0].properties.title
                })
                onComplete(data)
            })
        }
    })
}

function getLoginState() {
    gapi.checkLoggedIn(token => {
        sendMessage(ACTION_LOGIN_STATE_CHANGED, token !== undefined)
    })
}

function appendSheetData(text) {
    ensureSpreadsheetExists(() => {
        gapi.spreadsheets.appendValue(currentSpreadsheet, text)

        console.log("Saved: '" + text + "'")
    })
}

function getHistory() {
    ensureSpreadsheetExists(() =>
        gapi.spreadsheets.getValues(currentSpreadsheet, 5, data => {
            sendMessage(ACTION_DATA_CHANGED, data)
        })
    )
}

function getSpreadsheetInfo() {
    ensureSpreadsheetExists(data =>
        sendMessage(ACTION_SPREADSHEET_INFO_CHANGED, data.sheets)
    )
}

function getCurrentSpreadsheet() {
    sendMessage(ACTION_CURRENT_SPREADSHEET_CHANGED, currentSpreadsheet)
}

function setCurrentSpreadsheet(spreadsheet) {
    currentSpreadsheet = spreadsheet
    saveSettings()
    sendMessage(ACTION_CURRENT_SPREADSHEET_CHANGED, currentSpreadsheet)

    console.log("Current spreadsheet: " + JSON.stringify(currentSpreadsheet))
}

function onLoginStateChanged(signedIn) {
    sendMessage(ACTION_LOGIN_STATE_CHANGED, signedIn)
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: "Save selection: %s",
        contexts: ["selection"]
    })
})

chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        appendSheetData(info.selectionText)
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN:
                gapi.login()
                break
            case ACTION_LOGOUT:
                gapi.logout()
                break
            case ACTION_GET_LOGIN_STATE:
                getLoginState()
                break
            case ACTION_DEBUG:
                getHistory()
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
