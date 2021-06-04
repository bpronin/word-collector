const authSection = document.getElementById("login_section")
const optionsSection = document.getElementById("options_section")
const sheetEdit = document.getElementById("sheet_edit")
const spreadsheetLink = document.getElementById("spreadsheet_link")

let currentSpreadsheet

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

function updateSheetEditItems(sheets) {
    sheetEdit.innerHTML = ""

    if (sheets) {
        for (const sheet of sheets) {
            const option = document.createElement("option")
            option.value = sheet.properties.sheetId
            option.innerHTML = sheet.properties.title

            sheetEdit.appendChild(option)
        }

        sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
    }
}

function onSheetEditChange() {
    currentSpreadsheet.sheet = sheetEdit.value
    sendMessage(ACTION_SET_CURRENT_SPREADSHEET, currentSpreadsheet)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                if (request.data) {
                    authSection.style.display = "none"
                    optionsSection.style.display = "block"
                } else {
                    authSection.style.display = "block"
                    optionsSection.style.display = "none"
                }
                break
            case ACTION_CURRENT_SPREADSHEET_CHANGED:
                currentSpreadsheet = request.data
                updateControls()
                break
            case ACTION_SPREADSHEET_INFO_CHANGED:
                updateSheetEditItems(request.data)
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

authSection.style.display = "none"
optionsSection.style.display = "none"

sendMessage(ACTION_GET_LOGIN_STATE)
// sendMessage(ACTION_DEBUG)
sendMessage(ACTION_GET_SPREADSHEET_INFO)
