const $loginButton = element('login_button');
const $logoutButton = element('logout_button');
// const $spreadsheetMoreButton = element('spreadsheet_more_button')
const $sheetEdit = element('sheet_edit')
const $historyMoreButton = element('history_more_button')

let accountLoggedIn = false
let spreadsheetMoreSectionVisible = false
let historyMoreSectionVisible = false
let spreadsheetId
let spreadsheetTitle
let spreadsheetSheets

function updateLoginSection() {
    setVisible($loginButton, !accountLoggedIn)
    setVisible($logoutButton, accountLoggedIn)
    setVisible(element('options_sections'), accountLoggedIn)
}

function updateSpreadsheetSection() {
    const $nameLabel = element('spreadsheet_name_label')
    // const $idLabel = element('spreadsheet_id_label')
    if (spreadsheetId) {
        $nameLabel.innerHTML = spreadsheetTitle
        $nameLabel.href = spreadsheetUrl(spreadsheetId)
        // $idLabel.innerHTML = spreadsheetId
    } else {
        $nameLabel.innerHTML = ''
        $nameLabel.href = ''
        // $idLabel.innerHTML = ''
    }

    // setVisible(element('spreadsheet_more_section'), spreadsheetMoreSectionVisible)
    // $spreadsheetMoreButton.innerHTML = spreadsheetMoreSectionVisible ? 'expand_less' : 'expand_more'
}

function updateHistorySection() {
    setVisible(element('history_more_section'), historyMoreSectionVisible)
    $historyMoreButton.innerHTML = historyMoreSectionVisible ? 'expand_less' : 'expand_more'
}

function updateSpreadsheetSheetSection() {
    $sheetEdit.innerHTML = ''
    if (spreadsheetSheets) {
        Object.keys(spreadsheetSheets).forEach(id => {
            const $option = createElement($sheetEdit, 'option')
            $option.value = id
            $option.innerHTML = spreadsheetSheets[id]
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

function onHistoryChanged(history) {

    function spreadsheetName(item) {
        return item.spreadsheetId || ('[' + R('unknown') + ']')
    }

    function sheetName(item) {
        return spreadsheetSheets[item.sheet] || R('sheet_removed')
    }

    function formatTime(item) {
        return new Date(item.time).toLocaleString()
    }

    function onRowClick(item) {
        window.alert(
            R('text') + ': ' + item.text + '\n' +
            R('spreadsheet') + ': ' + spreadsheetName(item) + '\n' +
            R('spreadsheet_sheet') + ': ' + sheetName(item) + '\n' +
            R('time') + ': ' + formatTime(item)
        )
    }

    const $historyList = element('history_list')
    $historyList.innerHTML = ''  /*todo: update, instead of rebuild all rows */

    if (history) {
        for (const item of history) {
            const $row = document.createElement('div')
            $row.tabIndex = 0 /* makes row tabbale */
            $row.className = 'list_item'
            $row.addEventListener('click', async () => onRowClick(item))

            const $colText = document.createElement('div')
            $colText.className = 'list_column_60'
            $colText.innerHTML = item.text

            const $colSheet = document.createElement('div')
            $colSheet.className = 'list_column_20'
            $colSheet.innerHTML = sheetName(item)

            const $colTime = document.createElement('div')
            $colTime.className = 'list_column_20'
            $colTime.innerHTML = formatTime(item)

            $row.appendChild($colText)
            $row.appendChild($colSheet)
            $row.appendChild($colTime)
            $historyList.appendChild($row)
        }
    }

    $historyList.disabled = false
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
        alert(R('specified_spreadsheet_does_not_exists'))
    }
}

$loginButton.addEventListener('click', async () => {
    sendMessage(MSG_LOGIN)
})

$logoutButton.addEventListener('click', async () => {
    if (confirm(R('sign_out_from_google_alert'))) {
        sendMessage(MSG_LOGOUT)
    }
})

// $spreadsheetMoreButton.addEventListener('click', async () => {
//     spreadsheetMoreSectionVisible = !spreadsheetMoreSectionVisible
//     updateSpreadsheetSection()
// })

element('change_spreadsheet-button').addEventListener('click', async () => {
    let sid = prompt(R('enter_spreadsheet_id'), spreadsheetId)
    if (sid) {
        /* if input is URL strip it */
        const expr = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(sid)
        if (expr) {
            sid = expr[1]
        }
        sendMessage(MSG_SET_SPREADSHEET, sid)
    }
})

$sheetEdit.addEventListener('change', async (event) => {
    sendMessage(MSG_SET_CURRENT_SHEET, event.target.value)
})

$historyMoreButton.addEventListener('click', async () => {
    historyMoreSectionVisible = !historyMoreSectionVisible
    updateHistorySection()
    sendMessage(MSG_GET_HISTORY)
})

element('clear_history_button').addEventListener('click', async () => {
    if (confirm(R('clear_history_alert'))) {
        sendMessage(MSG_CLEAR_HISTORY)
    }
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
            case MSG_HISTORY_CHANGED:
                onHistoryChanged(request.data)
                break
        }
        sendResponse()
    }
)

localizeHtml()
updateLoginSection()
updateSpreadsheetSection()
updateSpreadsheetSheetSection()
updateHistorySection()

sendMessage(MSG_GET_LOGIN_STATE)
