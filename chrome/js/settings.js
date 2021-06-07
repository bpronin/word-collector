const KEY_SHEET_ID = "spreadsheet_id";
const KEY_SHEET_SHEET = "spreadsheet_sheet";
const KEY_HISTORY = "history";

const settings = {
    storage: chrome.storage.sync,

    get(keys, callback) {
        settings.storage.get(keys, callback)
    },

    put(data) {
        settings.storage.set(data)

        console.log("Settings saved: " + JSON.stringify(data))
    },

    remove(keys, callback) {
        settings.storage.remove(keys, callback)

        console.log("Settings removed: " + JSON.stringify(keys))
    }

    // addListener(listener) {
    //     chrome.storage.onChanged.addListener((changes, area) => {
    //         if (area === "sync") {
    //             for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
    //                 listener(key, oldValue, newValue)
    //             }
    //         }
    //     })
    // }
}

// settings.storage.clear()
//settings.remove(KEY_HISTORY)

// settings.storage.set({
//     // [KEY_SHEET_ID]: "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
//     [KEY_SHEET_ID]: "1z3faT6I-nCJmhXKVK54KeP5ZMFnQMc8Xr9DaM_IlooY",
//     [KEY_SHEET_SHEET]: 0
// })