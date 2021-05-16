const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU";

function saveSelection(text) {
    console.log("Saving: " + text);
}

chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Save selection: %s",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        saveSelection(info.selectionText);
    }
})

// chrome.runtime.onInstalled.addListener(() => {
//
// });
