const $authSection = $("login_section")
const $optionsSection = $("options_sections")
const $sheetEdit = $("sheet_edit")
const $spreadsheetLink = $("spreadsheet_link")
const $historyList = $("history_list")

let spreadsheetSheets

function onLoginStateChanged(loggedIn) {
    setVisible($authSection, !loggedIn)
    setVisible($optionsSection, loggedIn)
    if (loggedIn) {
        sendMessage(MSG_GET_SPREADSHEET)
    }
}

function onCurrentSheetChanged(sheet) {
    $sheetEdit.value = sheet
}

function onSpreadsheetChanged(info) {
    spreadsheetSheets = {}
    $sheetEdit.innerHTML = ""
    for (const sheet of info.sheets) {
        const id = sheet.properties.sheetId
        spreadsheetSheets[id] = sheet.properties.title

        const option = document.createElement("option")
        option.value = id
        option.innerHTML = spreadsheetSheets[id]

        $sheetEdit.appendChild(option)
    }
    $sheetEdit.disabled = false

    $spreadsheetLink.href = spreadsheetUrl(info.spreadsheetId)

    $historyList.disabled = true

    sendMessage(MSG_GET_CURRENT_SHEET)
    sendMessage(MSG_GET_HISTORY)
}

function onHistoryChanged(history) {

    function onRowClick(item) {
        const spreadsheet = item.spreadsheetId || ("[" + R("unknown") + "]")
        const title = spreadsheetSheets[item.sheet] || ("[" + R("removed") + " ID: " + item.sheet + "]")

        window.alert(
            R("text") + ": " + item.text + "\n" +
            R("spreadsheet") + ": " + spreadsheet + "\n" +
            R("spreadsheet_sheet") + ": " + title + "\n" +
            R("time") + ": " + new Date(item.time).toUTCString()
        )
    }

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

    $historyList.disabled = false
}

$spreadsheetLink.addEventListener("click", async (event) => {
    openUniqueTab(event.target.href)
})

$("settings_button").addEventListener("click", async () => {
    openUniqueTab(chrome.runtime.getURL("options.html"))
})

$("login_button").addEventListener("click", async () => {
    sendMessage(MSG_LOGIN)
})

$sheetEdit.addEventListener('change', async (event) => {
    sendMessage(MSG_SET_CURRENT_SHEET, event.target.value)
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.action) {
        case MSG_LOGIN_STATE_CHANGED:
            onLoginStateChanged(request.data);
            break
        case MSG_SPREADSHEET_CHANGED:
            onSpreadsheetChanged(request.data)
            break
        case MSG_CURRENT_SHEET_CHANGED:
            onCurrentSheetChanged(request.data)
            break
        case MSG_HISTORY_CHANGED:
            onHistoryChanged(request.data)
            break
    }
    sendResponse()
})

localizeHtml()
setVisible($authSection, false)
setVisible($optionsSection, false)
$sheetEdit.disabled = true
$historyList.disabled = true

sendMessage(MSG_GET_LOGIN_STATE)