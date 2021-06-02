const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

const authSection = document.getElementById("auth_section");
const optionsSection = document.getElementById("options_section");
const settingsButton = document.getElementById("settings_button");
const signInButton = document.getElementById("sign_in_button");
// const sheetEdit = document.getElementById("sheet_editor");
const sheetEdit = document.getElementById("sheet_page_edit");

function updateSheetPageEditItems(info) {
    sheetEdit.innerHTML = ""

    for (const sheet of info.sheets) {
        const title = sheet.properties.title;

        const option = document.createElement("option");
        option.value = title;
        option.innerHTML = title

        sheetEdit.appendChild(option);
    }

    sheetEdit.value = undefined
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                if (request.signedIn) {
                    authSection.style.display = "none"
                    optionsSection.style.display = "block"
                } else {
                    authSection.style.display = "block"
                    optionsSection.style.display = "none"
                }

                if (request.speadsheet) {
                    sheetEdit.value = spreadsheet.sheet
                }
                break;
            case ACTION_STREADSHEET_RECEIVED:
                updateSheetPageEditItems(request.data)
                break;
        }
        sendResponse()
    }
)

settingsButton.addEventListener("click", () => {
    chrome.tabs.query({url: OPTIONS_PAGE_URL}, tabs => {
        const tab = tabs[0]
        if (tab) {
            chrome.tabs.update(tab.id, {highlighted: true})
        } else {
            chrome.tabs.create({url: OPTIONS_PAGE_URL})
        }
    })
})

signInButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({action: ACTION_LOGIN})
})

authSection.style.display = "none"
optionsSection.style.display = "none"

chrome.runtime.sendMessage({action: ACTION_GET_SPREADSHEET})
chrome.runtime.sendMessage({action: ACTION_GET_LOGIN_STATE})
