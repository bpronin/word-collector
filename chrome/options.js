const statusLabel = document.getElementById("status_label")
const dataLabel = document.getElementById("data_label")
const signInButton = document.getElementById("sign_in_button")
const signOutButton = document.getElementById("sign_out_button")

/**
 *  Sign in the user upon button click.
 */
function onSignInClick() {
    chrome.runtime.sendMessage({action: "sign_in"}, response => {
        console.log("Message response: " + response)
    });
}

/**
 *  Sign out the user upon button click.
 */
function onSignOutClick() {
    chrome.runtime.sendMessage({action: "sign_out"}, response => {
        console.log("Message response: " + response)
    });
}

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
                dataLabel.innerHTML = JSON.stringify(request.data)
                break;
        }
        sendResponse("ok")
    }
);

signInButton.addEventListener("click", onSignInClick)
signOutButton.addEventListener("click", onSignOutClick)

document.getElementById("get_button").addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "get_data"});
})

chrome.runtime.sendMessage({action: "get_state"});
