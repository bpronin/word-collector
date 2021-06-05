const ACTION_SPREADSHEET_CHANGED = "spreadsheet-changed"
const ACTION_CURRENT_SHEET_CHANGED = "current-sheet-changed"
const ACTION_DATA_CHANGED = "data-changed"
const ACTION_DEBUG = "debug"
const ACTION_GET_CURRENT_SPREADSHEET = "get-current-spreadsheet"
const ACTION_GET_HISTORY = "get-history"
const ACTION_GET_LOGIN_STATE = "get-login-state"
const ACTION_GET_SPREADSHEET_INFO = "get-spreadsheet-info"
const ACTION_HISTORY_CHANGED = "history-changed"
const ACTION_LOGIN = "login"
const ACTION_LOGIN_STATE_CHANGED = "login-state-changed"
const ACTION_LOGOUT = "logout"
const ACTION_SET_CURRENT_SHEET = "set-current-sheet"
const ACTION_SET_SPREADSHEET = "set-spreadsheet"
const ACTION_SPREADSHEET_INFO_CHANGED = "spreadsheet-info-changed"

function sendMessage(action, data) {
    const message = {action: action, data: data};
    chrome.runtime.sendMessage(message)

    // console.log("Message sent:" + JSON.stringify(message))
}