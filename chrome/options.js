const $loginButton = $("login_button");
const $logoutButton = $("logout_button");
const $spreadsheetMoreButton = $("spreadsheet_more_button")

let accountLoggedIn = false
let spreadsheetMoreSectionVisible = false
let spreadsheetId
let spreadsheetTitle

function updateLoginSection() {
    setVisible($loginButton, !accountLoggedIn)
    setVisible($logoutButton, accountLoggedIn)
    setVisible($("options_sections"), accountLoggedIn)
}

function updateSpreadsheetSection() {
    const nameLabel = $("spreadsheet_name_label")
    const idLabel = $("spreadsheet_id_label")
    if (spreadsheetId) {
        nameLabel.innerHTML = spreadsheetTitle
        nameLabel.setAttribute("href", spreadsheetUrl(spreadsheetId))
        idLabel.innerHTML = spreadsheetId
    } else {
        nameLabel.innerHTML = ""
        nameLabel.setAttribute("href", "")
        idLabel.innerHTML = ""
    }

    setVisible($("spreadsheet_more_section"), spreadsheetMoreSectionVisible)
    $spreadsheetMoreButton.innerHTML = spreadsheetMoreSectionVisible ? "expand_less" : "expand_more"
}

function onLoginStateChanged(loggedIn) {
    accountLoggedIn = loggedIn
    updateLoginSection()
    if (accountLoggedIn) {
        sendMessage(MSG_GET_SPREADSHEET)
    }
}

function onCurrentSheetChanged(sheet) {
}

function onSpreadsheetInfoChanged(info) {
    if (info) {
        spreadsheetId = info.spreadsheetId
        spreadsheetTitle = info.properties.title
        updateSpreadsheetSection()
        sendMessage(MSG_GET_CURRENT_SHEET)
    } else {
        alert(R("Spreadsheet does not exists."))
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case MSG_LOGIN_STATE_CHANGED:
                onLoginStateChanged(request.data)
                break
            case MSG_SPREADSHEET_CHANGED:
                onSpreadsheetInfoChanged(request.data)
                break
            case MSG_CURRENT_SHEET_CHANGED:
                onCurrentSheetChanged(request.data);
                break;
        }
        sendResponse()
    }
)

$loginButton.addEventListener("click", () => {
    sendMessage(MSG_LOGIN)
})

$logoutButton.addEventListener("click", () => {
    if (confirm(R("Sign out from Google spreadsheets?"))) {
        sendMessage(MSG_LOGOUT)
    }
})

$spreadsheetMoreButton.addEventListener("click", () => {
    spreadsheetMoreSectionVisible = !spreadsheetMoreSectionVisible
    updateSpreadsheetSection()
})

$("change_spreadsheet-button").addEventListener("click", () => {
    const newSpreadsheetId = prompt(R("Enter spreadsheet ID"), spreadsheetId)
    if (newSpreadsheetId) {
        sendMessage(MSG_SET_SPREADSHEET, newSpreadsheetId)
    }
})

updateLoginSection()
updateSpreadsheetSection()
sendMessage(MSG_GET_LOGIN_STATE)
