const statusLabel = document.getElementById("status_label")
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
        if (request.action === "state_changed") {
            if (request.signedIn) {
                statusLabel.innerHTML = "Signed in"
            } else {
                statusLabel.innerHTML = "Signed out"
            }
        }
        sendResponse("ok")
    }
);

signInButton.addEventListener("click", onSignInClick)
signOutButton.addEventListener("click", onSignOutClick)

document.getElementById("get_button").addEventListener("click", () => {
    // sheets.values((data) => {
    //     console.log("Data:" + data.values.length)
    // })
})

chrome.runtime.sendMessage({action: "get_state"});
