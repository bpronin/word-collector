importScripts('js/resources.js', 'js/messages.js', 'js/settings.js', 'js/google-api.js')

const CONTEXT_MENU_ID = 'WORDS_COLLECTOR_CONTEXT_MENU'
const DEFAULT_SPREADSHEET_TITLE = 'word-collector'

let spreadsheetId
let spreadsheetSheet
let maxHistorySize = 100

function loadSettings() {
    settings.get([KEY_SHEET_ID, KEY_SHEET_SHEET], data => {
        spreadsheetId = data[KEY_SHEET_ID]
        spreadsheetSheet = data[KEY_SHEET_SHEET]
    })
}

function createSpreadsheet(name, onComplete) {
    gapi.spreadsheets.createSpreadsheet(name, info => {
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

            createSpreadsheet(DEFAULT_SPREADSHEET_TITLE, onComplete);
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

function updateHistory(value) {
    settings.get(KEY_HISTORY, data => {
        const history = data[KEY_HISTORY];

        let item = {
            text: value.text,
            translation: value.translation,
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

function openEditDialog() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let tabId = tabs[0].id;

        /* this is to inject multiple scripts */
        chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/html-util.js']}, () => {
            chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/word-collector.js']}, () => {
                // sendMessage('open-edit-frame', {
                //     text: 'TEXT TO EDIT',
                //     translation: 'TRANSLATION'
                // })
            })
        })
    })
}

function onGetLoginState() {
    gapi.checkLoggedIn(token => {
        sendMessage(MSG_LOGIN_STATE_CHANGED, token !== undefined)
    })
}

function onSendValueToSpreadsheet(data) {
    ensureSpreadsheetExists(info => {
        const range = formatSpreadsheetRange(info, spreadsheetSheet, 0)

        gapi.spreadsheets.appendValue(spreadsheetId, range, [data.text, data.translation], () => {
            updateHistory(data)

            console.log('Saved: ' + JSON.stringify(data))
        })
    })
}

function onDebug() {
    ensureSpreadsheetExists(info => {
            const range = formatSpreadsheetRange(info, spreadsheetSheet, 0)
            gapi.spreadsheets.getValues(spreadsheetId, range, data => {
                sendMessage(MSG_DATA_CHANGED, data)
            })
        }
    )
}

function onGetSpreadsheet() {
    ensureSpreadsheetExists(info =>
        sendMessage(MSG_SPREADSHEET_CHANGED, info)
    )
}

function onCreateSpreadsheet(spreadsheetTitle) {
    createSpreadsheet(spreadsheetTitle, (info =>
            sendMessage(MSG_SPREADSHEET_CHANGED, info)
    ))
}

function onSetSpreadsheet(spreadsheetId) {
    /* NOTE! Sheet will be found even if it is in trash! (todo: use Drive API to check that fact)*/
    gapi.spreadsheets.getSpreadsheet(spreadsheetId, info => {

        if (info) {
            console.log('Found spreadsheet: ' + spreadsheetId)

            spreadsheetId = info.spreadsheetId
            spreadsheetSheet = info.sheets[0].properties.sheetId

            settings.put({
                [KEY_SHEET_ID]: spreadsheetId,
                [KEY_SHEET_SHEET]: spreadsheetSheet
            })
        } else {
            console.log('Spreadsheet not found: ' + spreadsheetId)
        }

        sendMessage(MSG_SPREADSHEET_CHANGED, info)
    })
}

function onGetCurrentSheet() {
    sendMessage(MSG_CURRENT_SHEET_CHANGED, spreadsheetSheet)
}

function onSetCurrentSheet(sheet) {
    spreadsheetSheet = sheet
    settings.put({[KEY_SHEET_SHEET]: spreadsheetSheet})
    sendMessage(MSG_CURRENT_SHEET_CHANGED, spreadsheetSheet)

    console.log('Current sheet: ' + spreadsheetSheet)
}

function onGetHistory() {
    settings.get(KEY_HISTORY, data => {
        sendMessage(MSG_HISTORY_CHANGED, data.history)
    })
}

function onClearHistory() {
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
            onDebug()
            break
        case MSG_LOGIN:
            gapi.login()
            break
        case MSG_LOGOUT:
            gapi.logout()
            break
        case MSG_GET_LOGIN_STATE:
            onGetLoginState()
            break
        case MSG_GET_HISTORY:
            onGetHistory()
            break
        case MSG_GET_SPREADSHEET:
            onGetSpreadsheet()
            break
        case MSG_SET_SPREADSHEET:
            onSetSpreadsheet(request.data)
            break
        case MSG_CREATE_SPREADSHEET:
            onCreateSpreadsheet(request.data)
            break
        case MSG_GET_CURRENT_SHEET:
            onGetCurrentSheet()
            break
        case MSG_SET_CURRENT_SHEET:
            onSetCurrentSheet(request.data)
            break
        case MSG_CLEAR_HISTORY:
            onClearHistory()
            break
        case MSG_EDIT_TRANSLATION_COMPLETE:
            onSendValueToSpreadsheet(request.data)
            break
        default:
            throw ('Unknown action: ' + request.action)
    }

    sendResponse(result)
})

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        openEditDialog()
    }
})

loadSettings()
gapi.setup(onLoginStateChanged)
gapi.checkLoggedIn(token => {
    onLoginStateChanged(token !== undefined)
})

console.log('Initialized')