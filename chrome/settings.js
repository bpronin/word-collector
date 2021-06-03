const STORAGE_AREA = "sync"

const KEY_SHEET_ID = "spreadsheet_id";
const KEY_SHEET_SHEET = "spreadsheet_sheet";
const KEY_HISTORY = "history";

const settings = {
    storage: chrome.storage[STORAGE_AREA],

    put(data) {
        settings.storage.set(data)
    },

    get(keys, callback) {
        settings.storage.get(keys, callback)
    },

    addListener(listener) {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === STORAGE_AREA) {
                for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
                    listener(key, oldValue, newValue)
                }
            }
        })
    }
}

// chrome.storage[STORAGE_AREA].clear()
// chrome.storage[STORAGE_AREA].set({
//     [KEY_SHEET_ID]: "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
//     [KEY_SHEET_SHEET]: "en-ru"
//     // [KEY_SHEET_SHEET]: "pt-ru"
// })