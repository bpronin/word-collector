const statusLabel = document.getElementById("status_label")
const signInButton = document.getElementById("sign_in_button")
const signOutButton = document.getElementById("sign_out_button")
const dataLabel = document.getElementById("data_label");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case ACTION_LOGIN_STATE_CHANGED:
                if (request.signedIn) {
                    statusLabel.innerHTML = "Signed in"
                } else {
                    statusLabel.innerHTML = "Signed out"
                }
                break
            case ACTION_STREADSHEET_RECEIVED:
                let titles = []
                for (const sheet of request.data.sheets) {
                    titles.push(sheet.properties.title)
                }

                dataLabel.innerHTML = JSON.stringify(titles)
                break
            case ACTION_DATA_RECEIVED:
                dataLabel.innerHTML = JSON.stringify(request.data)
                break
        }
        sendResponse()
    }
)

signInButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({action: ACTION_LOGIN})
})

signOutButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({action: ACTION_LOGOUT})
})

document.getElementById("get_button").addEventListener("click", () => {
    chrome.runtime.sendMessage({action: ACTION_GET_DATA});
    // chrome.runtime.sendMessage({action: ACTION_GET_SPREADSHEET});
})

chrome.runtime.sendMessage({action: ACTION_GET_LOGIN_STATE});
