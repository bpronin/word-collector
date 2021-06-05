const authSection = document.getElementById("login_section")
const optionsSection = document.getElementById("options_section")
const spreadsheetMoreSection = document.getElementById("spreadsheet_more_section")
const spreadsheetMoreButton = document.getElementById("spreadsheet_more_button")

let accountLoggedIn = false
let spreadsheetMoreSectionVisible = false
let currentSpreadsheet
let spreadsheetInfo

function updateLoginSection() {
    setVisible(authSection, !accountLoggedIn)
    setVisible(optionsSection, accountLoggedIn)
}

function updateSpreadsheetSection() {
    const nameLabel = document.getElementById("spreadsheet_name_label")
    const idEdit = document.getElementById("spreadsheet_id_label")
    if (spreadsheetInfo) {
        nameLabel.innerHTML = spreadsheetInfo.properties.title
        idEdit.innerHTML = spreadsheetInfo.spreadsheetId
    } else {
        nameLabel.innerHTML = ""
        idEdit.innerHTML = ""
    }

    setVisible(spreadsheetMoreSection, spreadsheetMoreSectionVisible)
    spreadsheetMoreButton.innerHTML = spreadsheetMoreSectionVisible ? "expand_less" : "expand_more"
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
            case ACTION_DATA_CHANGED:
                const dataLabel = document.getElementById("data_label")
                dataLabel.innerHTML = JSON.stringify(request.data)
                break
            case ACTION_HISTORY_CHANGED:
                const list = document.getElementById("history_list");
                list.innerHTML = ""
                for (const item of request.data) {
                    const row = document.createElement("div")
                    row.innerHTML = item
                    list.appendChild(row);
                }
                break
        }
        sendResponse()
    }
)

document.getElementById("login_button").addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

document.getElementById("logout_button").addEventListener("click", () => {
    if (confirm("Sign out from Google spreadsheets?")) {
        sendMessage(ACTION_LOGOUT)
    }
})

document.getElementById("spreadsheet_more_button").addEventListener("click", () => {
    spreadsheetMoreSectionVisible = !spreadsheetMoreSectionVisible
    updateSpreadsheetSection()
})

document.getElementById("get_button").addEventListener("click", () => {
    sendMessage(ACTION_GET_HISTORY)
})

document.getElementById("link_button").addEventListener("click", () => {
    openUniqueTab(URL_GOOGLE_SPREADSHEETS + currentSpreadsheet.id)
})

updateLoginSection()
updateSpreadsheetSection()

sendMessage(ACTION_GET_LOGIN_STATE)