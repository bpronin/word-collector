importScripts("google-sheets.js")

const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU";

function onSignInStatusChanged(signedIn) {

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "sign_in_state_changed",
            signed_in: signedIn
        }, response => {
            console.log("Message response: " + response)
        });
    });
}

chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Save selection: %s",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        console.log("Saving: '" + info.selectionText + "'");

        sheets.append(info.selectionText)
    }
})

chrome.runtime.onInstalled.addListener(() => {
    sheets.setup(onSignInStatusChanged)

    console.log("Installed")
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case "get_state":
                sheets.authenticate(false, token => {
                    sendResponse({signedIn: (token !== undefined)})
                })
                break
            case "sign_in":
                sheets.signIn()
                sendResponse("ok")
                break
            case "sign_out":
                sheets.signOut()
                sendResponse("ok")
                break
        }
    }
);