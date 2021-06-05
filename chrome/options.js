const $loginButton = $("login_button");
const $logoutButton = $("logout_button");
const $spreadsheetMoreButton = $("spreadsheet_more_button")

let accountLoggedIn = false
let spreadsheetMoreSectionVisible = false
let spreadsheetId

function updateLoginSection() {
    setVisible($loginButton, !accountLoggedIn)
    setVisible($logoutButton, accountLoggedIn)
    setVisible($("options_sections"), accountLoggedIn)
}

function updateSpreadsheetSection(spreadsheetTitle) {
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
        sendMessage(ACTION_GET_SPREADSHEET_INFO)
    }
}

function onCurrentSheetChanged(sheet) {
}

function onSpreadsheetInfoChanged(info) {
    spreadsheetId = info.spreadsheetId
    updateSpreadsheetSection(info.properties.title)
    sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                onLoginStateChanged(request.data)
                break
            case ACTION_SPREADSHEET_INFO_CHANGED:
                onSpreadsheetInfoChanged(request.data)
                break
            case ACTION_CURRENT_SHEET_CHANGED:
                onCurrentSheetChanged(request.data);
                break;
        }
        sendResponse()
    }
)

$loginButton.addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

$logoutButton.addEventListener("click", () => {
    if (confirm("Sign out from Google spreadsheets?")) {
        sendMessage(ACTION_LOGOUT)
    }
})

$spreadsheetMoreButton.addEventListener("click", () => {
    spreadsheetMoreSectionVisible = !spreadsheetMoreSectionVisible
    updateSpreadsheetSection()
})

$("change_spreadsheet-button").addEventListener("click", () => {
    const newSpreadsheetId = prompt("Enter spreadsheet ID", spreadsheetId)
    if (newSpreadsheetId) {
        sendMessage(ACTION_SET_SPREADSHEET, newSpreadsheetId)
    }
})

updateLoginSection()
updateSpreadsheetSection()
sendMessage(ACTION_GET_LOGIN_STATE)
