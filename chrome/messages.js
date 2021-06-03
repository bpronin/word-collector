const ACTION_GET_SPREADSHEET_INFO = "get-spreadsheet"
const ACTION_SPREADSHEET_INFO_CHANGED = "spreadsheet-changed"
const ACTION_GET_CURRENT_SPREADSHEET = "get-current-spreadsheet"
const ACTION_SET_CURRENT_SPREADSHEET = "set-current-spreadsheet"
const ACTION_CURRENT_SPREADSHEET_CHANGED = "current-spreadsheet-changed"
const ACTION_GET_LOGIN_STATE = "get-login-state"
const ACTION_LOGIN_STATE_CHANGED = "login-state-changed"
const ACTION_DEBUG = "debug"
const ACTION_DATA_CHANGED = "data-changed"
const ACTION_LOGIN = "login"
const ACTION_LOGOUT = "logout"

function sendMessage(action, data) {
    chrome.runtime.sendMessage({action: action, data: data})
}