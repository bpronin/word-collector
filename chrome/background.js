importScripts('js/resources.js', 'js/messages.js', 'js/settings.js', 'js/google-api.js')

const CONTEXT_MENU_ID = 'WORDS_COLLECTOR_CONTEXT_MENU'

let spreadsheetId
let spreadsheetSheet
let maxHistorySize = 100

function loadSettings() {
    settings.get([KEY_SHEET_ID, KEY_SHEET_SHEET], data => {
        spreadsheetId = data[KEY_SHEET_ID]
        spreadsheetSheet = data[KEY_SHEET_SHEET]
    })
}

function createSpreadsheet(onComplete) {
    gapi.spreadsheets.createSpreadsheet(info => {
        console.log('New spreadsheet created:' + info.spreadsheetId)

        spreadsheetId = info.spreadsheetId
        spreadsheetSheet = info.sheets[0].properties.sheetId

        settings.put({
            [KEY_SHEET_ID]: spreadsheetId,
            [KEY_SHEET_SHEET]: spreadsheetSheet
        })

        onComplete(info)
    })
}

function ensureSpreadsheetExists(onComplete) {
    /* NOTE! Sheet will be found even if it is in trash! (todo: use Drive API to check that fact)*/
    gapi.spreadsheets.getSpreadsheet(spreadsheetId, info => {
        if (info) {
            console.log('Using existing spreadsheet: ' + spreadsheetId)

            onComplete(info)
        } else {
            console.log('Spreadsheet does not exists:' + spreadsheetId)

            createSpreadsheet(onComplete);
        }
    })
}

function formatSpreadsheetRange(info, sheetId, defaultSheetId) {
    const sheet = info.sheets.find(element => {
        return element.properties.sheetId === parseInt(sheetId)
    })

    if (sheet !== undefined) {
        return sheet.properties.title
    } else if (defaultSheetId !== undefined) {
        return formatSpreadsheetRange(info, defaultSheetId)
    } else {
        throw 'Invalid sheet id:' + sheetId
    }
}

function getLoginState() {
    gapi.checkLoggedIn(token => {
        sendMessage(MSG_LOGIN_STATE_CHANGED, token !== undefined)
    })
}

function sendValueToSpreadsheet(data) {
    console.log('Saving: ' + JSON.stringify(data))
    //
    // ensureSpreadsheetExists(info => {
    //     const range = formatSpreadsheetRange(info, spreadsheetSheet, 0)
    //
    //     gapi.spreadsheets.appendValue(spreadsheetId, range, data.text, () => {
    //         updateHistory(data.text)
    //
    //         console.log('Saved: ' + data.text)
    //     })
    // })
}

function getData() {
    ensureSpreadsheetExists(info => {
            const range = formatSpreadsheetRange(info, spreadsheetSheet, 0)
            gapi.spreadsheets.getValues(spreadsheetId, range, data => {
                sendMessage(MSG_DATA_CHANGED, data)
            })
        }
    )
}

function getSpreadsheet() {
    ensureSpreadsheetExists(data =>
        sendMessage(MSG_SPREADSHEET_CHANGED, data)
    )
}

function setSpreadsheet(newSpreadsheetId) {
    /* NOTE! Sheet will be found even if it is in trash! (todo: use Drive API to check that fact)*/
    gapi.spreadsheets.getSpreadsheet(newSpreadsheetId, info => {

        if (info) {
            console.log('Found spreadsheet: ' + newSpreadsheetId)

            spreadsheetId = info.spreadsheetId
            spreadsheetSheet = info.sheets[0].properties.sheetId

            settings.put({
                [KEY_SHEET_ID]: spreadsheetId,
                [KEY_SHEET_SHEET]: spreadsheetSheet
            })
        } else {
            console.log('Spreadsheet not found: ' + newSpreadsheetId)
        }

        sendMessage(MSG_SPREADSHEET_CHANGED, info)
    })
}

function getCurrentSheet() {
    sendMessage(MSG_CURRENT_SHEET_CHANGED, spreadsheetSheet)
}

function setCurrentSheet(sheet) {
    spreadsheetSheet = sheet
    settings.put({[KEY_SHEET_SHEET]: spreadsheetSheet})
    sendMessage(MSG_CURRENT_SHEET_CHANGED, spreadsheetSheet)

    console.log('Current sheet: ' + spreadsheetSheet)
}

function updateHistory(text) {
    settings.get(KEY_HISTORY, data => {
        const history = data[KEY_HISTORY];

        let item = {
            text: text,
            spreadsheetId: spreadsheetId,
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
        sendMessage(MSG_HISTORY_CHANGED, data.history)
    })
}

function getHistory() {
    settings.get(KEY_HISTORY, data => {
        sendMessage(MSG_HISTORY_CHANGED, data.history)
    })
}

function clearHistory() {
    settings.remove(KEY_HISTORY, () => {
        sendMessage(MSG_HISTORY_CHANGED)
    })
}

function onLoginStateChanged(loggedIn) {
    if (loggedIn) {
        chrome.contextMenus.create({
            id: CONTEXT_MENU_ID,
            title: i18n.get('save_to_collection'),
            contexts: ['selection']
        })

        console.log('Menu item created')
    } else {
        chrome.contextMenus.remove(CONTEXT_MENU_ID)

        console.log('Menu item removed')
    }

    sendMessage(MSG_LOGIN_STATE_CHANGED, loggedIn)
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    let result = 'ok'

    switch (request.action) {
        case MSG_DEBUG:
            getData()
            break
        case MSG_LOGIN:
            gapi.login()
            break
        case MSG_LOGOUT:
            gapi.logout()
            break
        case MSG_GET_LOGIN_STATE:
            getLoginState()
            break
        case MSG_GET_HISTORY:
            getHistory()
            break
        case MSG_GET_SPREADSHEET:
            getSpreadsheet()
            break
        case MSG_SET_SPREADSHEET:
            setSpreadsheet(request.data)
            break
        case MSG_GET_CURRENT_SHEET:
            getCurrentSheet()
            break
        case MSG_SET_CURRENT_SHEET:
            setCurrentSheet(request.data)
            break
        case MSG_CLEAR_HISTORY:
            clearHistory()
            break
        case MSG_EDIT_TRANSLATION_COMPLETE:
            sendValueToSpreadsheet(request.data)
            break
        default:
            throw ('Unknown action: ' + request.action)
    }

    sendResponse(result)
})

function callEditDialog() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let tabId = tabs[0].id;

        /* this is to inject multiple scripts */
        chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/html-util.js']}, () => {
            chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/edit-text.js']})
        })
    })
}

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        callEditDialog()
    }
})

loadSettings()
gapi.setup(onLoginStateChanged)
gapi.checkLoggedIn(token => {
    onLoginStateChanged(token !== undefined)
})

console.log('Initialized')