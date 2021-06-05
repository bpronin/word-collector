const $authSection = $("login_section")
const $optionsSection = $("options_sections")
const $sheetEdit = $("sheet_edit")
const $spreadsheetLink = $("spreadsheet_link")

let spreadsheetSheets

function onLoginStateChanged(loggedIn) {
    setVisible($authSection, !loggedIn)
    setVisible($optionsSection, loggedIn)
    if (loggedIn) {
        sendMessage(ACTION_GET_SPREADSHEET_INFO)
    }
}

function onCurrentSheetChanged(sheet) {
    $sheetEdit.value = sheet
}

function onSpreadsheetChanged(info) {
    spreadsheetSheets = info.sheets

    $sheetEdit.innerHTML = ""

    for (const sheet of spreadsheetSheets) {

        const option = document.createElement("option")
        option.value = sheet.properties.sheetId
        option.innerHTML = sheet.properties.title

        $sheetEdit.appendChild(option)
    }

    $spreadsheetLink.setAttribute("href", spreadsheetUrl(info.spreadsheetId))

    sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
    sendMessage(ACTION_GET_HISTORY)
}

function onHistoryChanged(history) {

    function onRowClick(item) {
        const sheet = spreadsheetSheets.find((sheet) => {
            return sheet.properties.sheetId === parseInt(item.sheet)
        })

        const title = sheet ? sheet.properties.title : R("[removed]")

        window.alert(
            R("Text: ") + item.text + "\n" +
            R("Sheet: ") + title + "\n" +
            R("Time: ") + new Date(item.time).toUTCString()
        )
    }

    const $historyList = $("history_list");
    $historyList.innerHTML = ""  /*todo: update, do not rebuild all rows */
    for (let index = 0; index < history.length; index++) {
        const item = history[index];

        const row = document.createElement("div")
        row.tabIndex = 0 /* makes row tabbale */
        row.className = "list_item"
        row.innerHTML = item.text
        row.addEventListener("click", () => onRowClick(item))

        $historyList.appendChild(row);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case ACTION_LOGIN_STATE_CHANGED:
            onLoginStateChanged(request.data);
            break
        case ACTION_SPREADSHEET_INFO_CHANGED:
            onSpreadsheetChanged(request.data)
            break
        case ACTION_CURRENT_SHEET_CHANGED:
            onCurrentSheetChanged(request.data)
            break
        case ACTION_HISTORY_CHANGED:
            onHistoryChanged(request.data)
            break
    }
    sendResponse()
})

$spreadsheetLink.addEventListener("click", (event) => {
    openUniqueTab(event.target.href)
})

$("settings_button").addEventListener("click", () => {
    openUniqueTab(chrome.runtime.getURL("options.html"))
})

$("login_button").addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

$sheetEdit.addEventListener('change', (event) => {
    sendMessage(ACTION_SET_CURRENT_SHEET, event.target.value)
})

setVisible($authSection, false)
setVisible($optionsSection, false)
sendMessage(ACTION_GET_LOGIN_STATE)