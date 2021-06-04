const authSection = document.getElementById("login_section")
const optionsSection = document.getElementById("options_section")
const sheetEdit = document.getElementById("sheet_edit")
const spreadsheetLink = document.getElementById("spreadsheet_link")

let currentSpreadsheet
let spreadsheetSheetsInfo

function setVisible(component, visible) {
    component.style.display = visible ? "block" : "none"
}

function openUniqueTab(url) {
    chrome.tabs.query({url: url + "*"}, tabs => {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, {highlighted: true})
        } else {
            chrome.tabs.create({url: url})
        }
    })
}

function getSpreadsheetUrl() {
    return "https://docs.google.com/spreadsheets/d/" + currentSpreadsheet.id
}

function updateControls() {
    sheetEdit.value = currentSpreadsheet.sheet
    spreadsheetLink.setAttribute("href", getSpreadsheetUrl())
}

function updateSheetEditItems() {
    sheetEdit.innerHTML = ""

    for (const sheet of spreadsheetSheetsInfo) {
        const option = document.createElement("option")
        option.value = sheet.properties.sheetId
        option.innerHTML = sheet.properties.title

        sheetEdit.appendChild(option)
    }

    sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
}

function updateHistoryList(items = []) {

    function onRowClick(item) {
        const sheetInfo = spreadsheetSheetsInfo.find((sheet) => {
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
    for (let index = 0; index < items.length; index++) {
        const item = items[index];

        const row = document.createElement("div")
        row.tabIndex = 0 /* makes row tabbale */
        row.className = "list_item"
        row.setAttribute("item_index", index)
        row.addEventListener("click", () => onRowClick(item))
        row.innerHTML = item.text

        list.appendChild(row);
    }
}

function onSheetEditChange() {
    currentSpreadsheet.sheet = sheetEdit.value
    sendMessage(ACTION_SET_CURRENT_SPREADSHEET, currentSpreadsheet)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                setVisible(authSection, !request.data)
                setVisible(optionsSection, request.data)
                break
            case ACTION_CURRENT_SPREADSHEET_CHANGED:
                currentSpreadsheet = request.data
                updateControls()
                break
            case ACTION_SPREADSHEET_INFO_CHANGED:
                spreadsheetSheetsInfo = request.data
                updateSheetEditItems()
                break
            case ACTION_HISTORY_CHANGED:
                updateHistoryList(request.data.history)
                break
        }
        sendResponse()
    }
)

spreadsheetLink.addEventListener("click", () => {
    openUniqueTab(getSpreadsheetUrl())
})

document.getElementById("settings_button").addEventListener("click", () => {
    openUniqueTab(chrome.runtime.getURL("options.html"))
})

document.getElementById("login_button").addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

sheetEdit.onchange = onSheetEditChange

setVisible(authSection, false)
setVisible(optionsSection, false)

sendMessage(ACTION_GET_LOGIN_STATE)
// sendMessage(ACTION_DEBUG)
sendMessage(ACTION_GET_SPREADSHEET_INFO)
sendMessage(ACTION_GET_HISTORY)
