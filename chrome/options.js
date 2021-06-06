const $loginButton = $("login_button");
const $logoutButton = $("logout_button");
const $spreadsheetMoreButton = $("spreadsheet_more_button")
const $sheetEdit = $("sheet_edit")

let accountLoggedIn = false
let spreadsheetMoreSectionVisible = false
let spreadsheetId
let spreadsheetTitle
let spreadsheetSheets

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
        nameLabel.href = spreadsheetUrl(spreadsheetId)
        idLabel.innerHTML = spreadsheetId
    } else {
        nameLabel.innerHTML = ""
        nameLabel.href = ""
        idLabel.innerHTML = ""
    }

    setVisible($("spreadsheet_more_section"), spreadsheetMoreSectionVisible)
    $spreadsheetMoreButton.innerHTML = spreadsheetMoreSectionVisible ? "expand_less" : "expand_more"
}

function updateSpreadsheetSheetSection() {
    $sheetEdit.innerHTML = ""
    if (spreadsheetSheets) {
        Object.keys(spreadsheetSheets).forEach(id => {
            const option = document.createElement("option")
            option.value = id
            option.innerHTML = spreadsheetSheets[id]
            $sheetEdit.appendChild(option)
        })

        $sheetEdit.disabled = false
    }
}

function onLoginStateChanged(loggedIn) {
    accountLoggedIn = loggedIn
    updateLoginSection()
    if (accountLoggedIn) {
        sendMessage(MSG_GET_SPREADSHEET)
    }
}

function onCurrentSheetChanged(sheet) {
    $sheetEdit.value = sheet
}

function onSpreadsheetChanged(info) {
    if (info) {
        spreadsheetId = info.spreadsheetId
        spreadsheetTitle = info.properties.title

        spreadsheetSheets = {}
        for (const sheet of info.sheets) {
            spreadsheetSheets[sheet.properties.sheetId] = sheet.properties.title
        }

        updateSpreadsheetSection()
        updateSpreadsheetSheetSection()
        sendMessage(MSG_GET_CURRENT_SHEET)
    } else {
        alert(R("Specified spreadsheet does not exists."))
    }
}

$loginButton.addEventListener("click", async () => {
    sendMessage(MSG_LOGIN)
})

$logoutButton.addEventListener("click", async () => {
    if (confirm(R("Sign out from Google spreadsheets?"))) {
        sendMessage(MSG_LOGOUT)
    }
})

$spreadsheetMoreButton.addEventListener("click", async () => {
    spreadsheetMoreSectionVisible = !spreadsheetMoreSectionVisible
    updateSpreadsheetSection()
})

$("change_spreadsheet-button").addEventListener("click", async () => {
    const newSpreadsheetId = prompt(R("Enter spreadsheet ID"), spreadsheetId)
    if (newSpreadsheetId) {
        sendMessage(MSG_SET_SPREADSHEET, newSpreadsheetId)
    }
})

$sheetEdit.addEventListener('change', async (event) => {
    sendMessage(MSG_SET_CURRENT_SHEET, event.target.value)
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        switch (request.action) {
            case MSG_LOGIN_STATE_CHANGED:
                onLoginStateChanged(request.data)
                break
            case MSG_SPREADSHEET_CHANGED:
                onSpreadsheetChanged(request.data)
                break
            case MSG_CURRENT_SHEET_CHANGED:
                onCurrentSheetChanged(request.data);
                break;
        }
        sendResponse()
    }
)

updateLoginSection()
updateSpreadsheetSection()
updateSpreadsheetSheetSection()

sendMessage(MSG_GET_LOGIN_STATE)
