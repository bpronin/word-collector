const ACTION_GET_SPREADSHEET_INFO = "get-spreadsheet-info"
const ACTION_SPREADSHEET_INFO_CHANGED = "spreadsheet-info-changed"
const ACTION_GET_CURRENT_SPREADSHEET = "get-current-spreadsheet"
const ACTION_SET_CURRENT_SPREADSHEET = "set-current-spreadsheet"
const ACTION_CURRENT_SPREADSHEET_CHANGED = "current-spreadsheet-changed"
const ACTION_GET_LOGIN_STATE = "get-login-state"
const ACTION_LOGIN_STATE_CHANGED = "login-state-changed"
const ACTION_DEBUG = "debug"
const ACTION_DATA_CHANGED = "data-changed"
const ACTION_LOGIN = "login"
const ACTION_LOGOUT = "logout"
const ACTION_GET_HISTORY = "get-history"
const ACTION_HISTORY_CHANGED = "history-changed"

function sendMessage(action, data) {
    const message = {action: action, data: data};
    chrome.runtime.sendMessage(message)

    console.log("Message sent:" + JSON.stringify(message))
}