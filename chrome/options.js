const authSection = document.getElementById("login_section")
const optionsSection = document.getElementById("options_section")

let currentSpreadsheet
let spreadsheetInfo

function onLoginStateChanged(loggedIn) {
    setVisible(authSection, !loggedIn)
    setVisible(optionsSection, loggedIn)
    if (loggedIn) {
        sendMessage(ACTION_GET_SPREADSHEET_INFO)
    }
}

function onCurrentSpreadseetChanged(spreadsheet) {
    currentSpreadsheet = spreadsheet
}

function onSpreadsheetInfoChanged(info) {
    spreadsheetInfo = info
    document.getElementById("spreadsheet_label").innerHTML = spreadsheetInfo.properties.title
    sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
    // sendMessage(ACTION_GET_HISTORY)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                onLoginStateChanged(request.data)
                break
            case ACTION_CURRENT_SPREADSHEET_CHANGED:
                onCurrentSpreadseetChanged(request.data);
                break;
            case ACTION_SPREADSHEET_INFO_CHANGED:
                onSpreadsheetInfoChanged(request.data)
                break
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

document.getElementById("spreadsheet_button").addEventListener("click", () => {
    alert("Spreadsheet button")
})

document.getElementById("get_button").addEventListener("click", () => {
    sendMessage(ACTION_GET_HISTORY)
})

document.getElementById("link_button").addEventListener("click", () => {
    openUniqueTab(URL_GOOGLE_SPREADSHEETS + currentSpreadsheet.id)
})

setVisible(authSection, false)
setVisible(optionsSection, false)
sendMessage(ACTION_GET_LOGIN_STATE)