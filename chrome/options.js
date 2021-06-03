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
        }
        sendResponse()
    }
)

signInButton.addEventListener("click", () => {
    sendMessage(ACTION_LOGIN)
})

signOutButton.addEventListener("click", () => {
    sendMessage(ACTION_LOGOUT)
})

document.getElementById("get_button").addEventListener("click", () => {
    sendMessage(ACTION_DEBUG)
})

sendMessage(ACTION_GET_LOGIN_STATE)
