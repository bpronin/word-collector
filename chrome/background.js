importScripts("messages.js", "settings.js", "google-api.js")

const CONTEXT_MENU_ID = "WORDS_COLLECTOR_CONTEXT_MENU"

let spreadsheetId
let spreadsheetSheet
let maxHistorySize = 100

function loadSettings() {
    settings.get([KEY_SHEET_ID, KEY_SHEET_SHEET], data => {
        spreadsheetId = data[KEY_SHEET_ID]
        spreadsheetSheet = data[KEY_SHEET_SHEET]
    })
}

function saveSettings() {
    settings.put({
        [KEY_SHEET_ID]: spreadsheetId,
        [KEY_SHEET_SHEET]: spreadsheetSheet
    })
}

function ensureSpreadsheetExists(onComplete) {
    /* NOTE! Sheet will be found even if it is in trash! (todo: use Drive API to check that fact)*/
    gapi.spreadsheets.getSpreadsheet(spreadsheetId, data => {
        if (data !== undefined) {
            console.log("Using existing spreadsheet: " + spreadsheetId)

            onComplete(data)
        } else {
            gapi.spreadsheets.createSpreadsheet(data => {
                console.log("New spreadsheet created:" + data.spreadsheetId)

                spreadsheetId = data.spreadsheetId
                setCurrentSheet(data.sheets[0].properties.sheetId)
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

function getSpreadsheetRange(info, sheetId, defaultSheetId) {
    const sheet = info.sheets.find(element => {
        return element.properties.sheetId === parseInt(sheetId)
    })

    if (sheet !== undefined) {
        return sheet.properties.title
    } else if (defaultSheetId !== undefined) {
        return getSpreadsheetRange(info, defaultSheetId)
    } else {
        throw "Invalid sheet id:" + sheetId
    }
}

function appendSheetData(text) {
    ensureSpreadsheetExists(info => {
        const range = getSpreadsheetRange(info, spreadsheetSheet, 0)
        gapi.spreadsheets.appendValue(spreadsheetId, range, text, () => {
            updateHistory(text)

            console.log("Saved: '" + text + "'")
        })
    })
}

function getData() {
    ensureSpreadsheetExists(info => {
            const range = getSpreadsheetRange(info, spreadsheetSheet, 0)
            gapi.spreadsheets.getValues(spreadsheetId, range, data => {
                sendMessage(ACTION_DATA_CHANGED, data)
            })
        }
    )
}

function getSpreadsheetInfo() {
    ensureSpreadsheetExists(data =>
        sendMessage(ACTION_SPREADSHEET_INFO_CHANGED, data)
    )
}

function getCurrentSheet() {
    sendMessage(ACTION_CURRENT_SHEET_CHANGED, spreadsheetSheet)
}

function setCurrentSheet(sheet) {
    spreadsheetSheet = sheet
    saveSettings()
    sendMessage(ACTION_CURRENT_SHEET_CHANGED, spreadsheetSheet)

    console.log("Current sheet: " + spreadsheetSheet)
}

function onLoginStateChanged(signedIn) {
    sendMessage(ACTION_LOGIN_STATE_CHANGED, signedIn)
}

function updateHistory(text) {
    settings.get(KEY_HISTORY, data => {
        const history = data[KEY_HISTORY];

        let item = {
            text: text,
            sheet: spreadsheetSheet,
            time: Date.now()
        }

        if (history === undefined) {
            data[KEY_HISTORY] = [item]
        } else {
            while (history.length > maxHistorySize) {
                history.pop()
            }
            history.unshift(item)
        }
        settings.put(data)
        sendMessage(ACTION_HISTORY_CHANGED, data.history)
    })
}

function getHistory() {
    settings.get(KEY_HISTORY, data => {
        sendMessage(ACTION_HISTORY_CHANGED, data.history)
    })
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: TEXT_SAVE_SELECTION,
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
            case ACTION_DEBUG:
                getData()
                break
            case ACTION_LOGIN:
                gapi.login()
                break
            case ACTION_LOGOUT:
                gapi.logout()
                break
            case ACTION_GET_LOGIN_STATE:
                getLoginState()
                break
            case ACTION_GET_HISTORY:
                getHistory()
                break
            case ACTION_GET_SPREADSHEET_INFO:
                getSpreadsheetInfo()
                break
            case ACTION_GET_CURRENT_SPREADSHEET:
                getCurrentSheet()
                break
            case ACTION_SET_CURRENT_SHEET:
                setCurrentSheet(request.data)
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
