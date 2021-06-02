const STORAGE_AREA = "sync"

const KEY_SHEET_ID = "spreadsheet_id";
const KEY_SHEET_SHEET = "spreadsheet_sheet";

const settings = {

    setSpreadsheet(data) {
        chrome.storage[STORAGE_AREA].set(data)
    },

    getSpreadsheet(callback) {
        chrome.storage[STORAGE_AREA].get([KEY_SHEET_ID, KEY_SHEET_SHEET], callback)
    },

    addListener(listener) {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === STORAGE_AREA) {
                for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
                    // console.log(
                    //     `Storage key "${key}" in namespace "${namespace}" changed.`,
                    //     `Old value was "${oldValue}", new value is "${newValue}".`
                    // )
                    listener(key, oldValue, newValue)
                }
            }
        })
    }
}

chrome.storage[STORAGE_AREA].clear()

settings.setSpreadsheet({
    [KEY_SHEET_ID]: "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
    [KEY_SHEET_SHEET]: "en-ru"
    // [KEY_SHEET_SHEET]: "pt-ru"
})