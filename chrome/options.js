const statusLabel = document.getElementById("status_label")
const signInButton = document.getElementById("sign_in_button")
const signOutButton = document.getElementById("sign_out_button")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case "state_changed":
                if (request.signedIn) {
                    statusLabel.innerHTML = "Signed in"
                } else {
                    statusLabel.innerHTML = "Signed out"
                }
                break;

            case "data_received":
                document.getElementById("data_label").innerHTML = JSON.stringify(request.data)
                break;
        }
        sendResponse()
    }
)

signInButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "sign_in"})
})

signOutButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "sign_out"})
})

document.getElementById("get_button").addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "get_data"});
})

chrome.runtime.sendMessage({action: "get_state"});
