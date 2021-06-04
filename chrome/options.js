let currentSpreadsheet

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const dataLabel = document.getElementById("data_label")

        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                document.getElementById("status_label").innerHTML = request.data ? "Signed in" : "Signed out"
                sendMessage(ACTION_GET_CURRENT_SPREADSHEET)
                sendMessage(ACTION_GET_HISTORY)
                break
            case ACTION_SPREADSHEET_INFO_CHANGED:
                let titles = []
                for (const sheet of request.data.sheets) {
                    titles.push(sheet.properties.title)
                }

                dataLabel.innerHTML = JSON.stringify(titles)
                break
            case ACTION_DATA_CHANGED:
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
            case ACTION_CURRENT_SPREADSHEET_CHANGED:
                currentSpreadsheet = request.data
                document.getElementById("sheet_label").innerHTML = JSON.stringify(currentSpreadsheet)
                break;
        }
        sendResponse()
    }
)

document.getElementById("sign_in_button").addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

document.getElementById("sign_out_button").addEventListener("click", () => {
    sendMessage(ACTION_LOGOUT)
})

document.getElementById("get_button").addEventListener("click", () => {
    sendMessage(ACTION_GET_HISTORY)
})

document.getElementById("link_button").addEventListener("click", () => {
    openUniqueTab(URL_GOOGLE_SPREADSHEETS + currentSpreadsheet.id)
})

sendMessage(ACTION_GET_LOGIN_STATE)