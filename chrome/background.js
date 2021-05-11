const CONTEXT_MENU_ID = "WORD_COLLECTOR_CONTEXT_MENU";

function onSaveSelection(info) {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        console.log("Saving: " + info.selectionText);
    }
}

chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Save selection: %s",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(onSaveSelection)