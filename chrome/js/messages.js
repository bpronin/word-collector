const MSG_LOGIN = 'login'
const MSG_LOGOUT = 'logout'
const MSG_GET_LOGIN_STATE = 'get-login-state'
const MSG_LOGIN_STATE_CHANGED = 'login-state-changed'

const MSG_GET_SPREADSHEET = 'get-spreadsheet'
const MSG_SET_SPREADSHEET = 'set-spreadsheet'
const MSG_CREATE_SPREADSHEET = 'create-spreadsheet'
const MSG_SPREADSHEET_CHANGED = 'spreadsheet-changed'

const MSG_GET_CURRENT_SHEET = 'get-current-sheet'
const MSG_SET_CURRENT_SHEET = 'set-current-sheet'
const MSG_CURRENT_SHEET_CHANGED = 'current-sheet-changed'

const MSG_GET_HISTORY = 'get-history'
const MSG_CLEAR_HISTORY = 'clear-history'
const MSG_HISTORY_CHANGED = 'history-changed'

const MSG_DATA_CHANGED = 'data-changed'
const MSG_EDIT_TRANSLATION_COMPLETE = 'edit-translation-complete'

const MSG_DEBUG = 'debug'

function sendMessage(action, data) {
    const message = {action: action, data: data};
    chrome.runtime.sendMessage(message)

    // console.log('Message sent: ' + JSON.stringify(message))
}