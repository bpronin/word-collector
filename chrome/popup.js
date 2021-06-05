const authSection = document.getElementById("login_section")
const optionsSection = document.getElementById("options_section")
const sheetEdit = document.getElementById("sheet_edit")
const spreadsheetLink = document.getElementById("spreadsheet_link")

let currentSpreadsheet
let spreadsheetInfo

function onLoginStateChanged(loggedIn) {
    setVisible(authSection, !loggedIn)
    setVisible(optionsSection, loggedIn)
    if (loggedIn) {
        sendMessage(ACTION_GET_SPREADSHEET_INFO)
    }
}

function onCurrentSpreadsheetChanged(spreadsheet) {
    currentSpreadsheet = spreadsheet
    sheetEdit.value = currentSpreadsheet.sheet
    spreadsheetLink.setAttribute("href", URL_GOOGLE_SPREADSHEETS + currentSpreadsheet.id)
}

function onSpreadsheetInfoChanged(info) {
    spreadsheetInfo = info

    sheetEdit.innerHTML = ""

    for (const sheet of spreadsheetInfo.sheets) {
        const option = document.createElement("option")
        option.value = sheet.properties.sheetId
        option.innerHTML = sheet.properties.title

        sheetEdit.appendChild(option)
    }

    sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
    sendMessage(ACTION_GET_HISTORY)
}

function onHistoryChanged(history) {

    function onRowClick(item) {
        const sheetInfo = spreadsheetInfo.sheets.find((sheet) => {
            return sheet.properties.sheetId === parseInt(item.sheet)
        })

        window.alert(
            "Text: " + item.text + "\n" +
            "Sheet: " + sheetInfo.properties.title + "\n" +
            "Time: " + new Date(item.time).toUTCString()
        )
    }

    const list = document.getElementById("history_list");
    list.innerHTML = ""  /*todo: update, do not rebuild all rows */
    for (let index = 0; index < history.length; index++) {
        const item = history[index];

        const row = document.createElement("div")
        row.tabIndex = 0 /* makes row tabbale */
        row.className = "list_item"
        row.innerHTML = item.text
        row.addEventListener("click", () => onRowClick(item))

        list.appendChild(row);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case ACTION_LOGIN_STATE_CHANGED:
            onLoginStateChanged(request.data);
            break
        case ACTION_SPREADSHEET_INFO_CHANGED:
            onSpreadsheetInfoChanged(request.data)
            break
        case ACTION_CURRENT_SPREADSHEET_CHANGED:
            onCurrentSpreadsheetChanged(request.data)
            break
        case ACTION_HISTORY_CHANGED:
            onHistoryChanged(request.data)
            break
    }
    sendResponse()
})

spreadsheetLink.addEventListener("click", (event) => {
    openUniqueTab(event.target.href)
})

document.getElementById("settings_button").addEventListener("click", () => {
    openUniqueTab(chrome.runtime.getURL("options.html"))
})

document.getElementById("login_button").addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

sheetEdit.addEventListener('change', (event) => {
    currentSpreadsheet.sheet = event.target.value
    sendMessage(ACTION_SET_CURRENT_SPREADSHEET, currentSpreadsheet)
})

setVisible(authSection, false)
setVisible(optionsSection, false)
sendMessage(ACTION_GET_LOGIN_STATE)