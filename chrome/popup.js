const authSection = document.getElementById("auth_section");
const optionsSection = document.getElementById("options_section");
const settingsButton = document.getElementById("settings_button");
const signInButton = document.getElementById("sign_in_button");
// const sheetEdit = document.getElementById("sheet_editor");
const sheetEdit = document.getElementById("sheet_page_edit");

let currentSpreadsheet

function updateSheetEditItems(info) {
    sheetEdit.innerHTML = ""

    if (info) {
        for (const sheet of info.sheets) {
            const title = sheet.properties.title;

            const option = document.createElement("option");
            option.value = title;
            option.innerHTML = title

            sheetEdit.appendChild(option);
        }

        sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
    }

    // sheetEdit.value = undefined
}

function onSheetEditChange() {
    currentSpreadsheet.sheet = sheetEdit.value
    sendMessage(ACTION_SET_CURRENT_SPREADSHEET, currentSpreadsheet)
}

function updateControls() {
    console.log("CURRENT SHEET:" + JSON.stringify(currentSpreadsheet))
    sheetEdit.value = currentSpreadsheet.sheet
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
                break;
            case ACTION_CURRENT_SPREADSHEET_CHANGED:
                currentSpreadsheet = request.data
                updateControls()
                break;
            case ACTION_SPREADSHEET_INFO_CHANGED:
                updateSheetEditItems(request.data)
                break;
        }
        sendResponse()
    }
)

settingsButton.addEventListener("click", () => {
    const optionsUrl = chrome.runtime.getURL("options.html")

    chrome.tabs.query({url: optionsUrl}, tabs => {
        const tab = tabs[0]
        if (tab) {
            chrome.tabs.update(tab.id, {highlighted: true})
        } else {
            chrome.tabs.create({url: optionsUrl})
        }
    })
})

signInButton.addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

sheetEdit.onchange = onSheetEditChange

authSection.style.display = "none"
optionsSection.style.display = "none"

sendMessage(ACTION_GET_LOGIN_STATE)
sendMessage(ACTION_GET_SPREADSHEET_INFO)
//chrome.runtime.sendMessage({action: ACTION_GET_CURRENT_SPREADSHEET})
