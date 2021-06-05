const $loginButton = $("login_button");
const $logoutButton = $("logout_button");
const $spreadsheetMoreButton = $("spreadsheet_more_button")

let accountLoggedIn = false
let spreadsheetMoreSectionVisible = false
let spreadsheetInfo
let currentSpreadsheet

function updateLoginSection() {
    setVisible($loginButton, !accountLoggedIn)
    setVisible($logoutButton, accountLoggedIn)
    setVisible($("options_sections"), accountLoggedIn)
}

function updateSpreadsheetSection() {
    const nameLabel = $("spreadsheet_name_label")
    const idLabel = $("spreadsheet_id_label")
    if (spreadsheetInfo) {
        nameLabel.innerHTML = spreadsheetInfo.properties.title
        nameLabel.setAttribute("href", spreadsheetUrl(spreadsheetInfo.spreadsheetId))
        idLabel.innerHTML = spreadsheetInfo.spreadsheetId
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

function onCurrentSpreadsheetChanged(spreadsheet) {
    currentSpreadsheet = spreadsheet
}

function onSpreadsheetInfoChanged(info) {
    spreadsheetInfo = info
    updateSpreadsheetSection()
    sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
    // sendMessage(ACTION_GET_HISTORY)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                onLoginStateChanged(request.data)
                break
            case ACTION_SPREADSHEET_INFO_CHANGED:
                onSpreadsheetInfoChanged(request.data)
                break
            case ACTION_CURRENT_SPREADSHEET_CHANGED:
                onCurrentSpreadsheetChanged(request.data);
                break;
            // case ACTION_HISTORY_CHANGED:
                // const list = $("history_list");
                // list.innerHTML = ""
                // for (const item of request.data) {
                //     const row = document.createElement("div")
                //     row.innerHTML = item
                //     list.appendChild(row);
                // }
                // break
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

updateLoginSection()
updateSpreadsheetSection()
sendMessage(ACTION_GET_LOGIN_STATE)
