const KEY_SHEET_ID = "spreadsheet_id";
const KEY_SHEET_SHEET = "spreadsheet_sheet";
const KEY_HISTORY = "history";

const TEXT_SAVE_SELECTION = "Save selection: %s";

const settings = {
    storage: chrome.storage.sync,

    put(data) {
        settings.storage.set(data)
    },

    get(keys, callback) {
        settings.storage.get(keys, callback)
    },

    addListener(listener) {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === "sync") {
                for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
                    listener(key, oldValue, newValue)
                }
            }
        })
    }
}

// settings.storage.clear()
//settings.storage.remove(KEY_HISTORY)

// settings.storage.set({
//     // [KEY_SHEET_ID]: "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
//     [KEY_SHEET_ID]: "1z3faT6I-nCJmhXKVK54KeP5ZMFnQMc8Xr9DaM_IlooY",
//     [KEY_SHEET_SHEET]: 0
// })