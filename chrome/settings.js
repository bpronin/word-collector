const STORAGE_AREA = "sync"
const KEY_SHEET_ID = "spreadsheet_id";
const KEY_SHEET_SHEET = "spreadsheet_sheet";

const settings = {

    setSpreadsheet(spreadsheet) {
        chrome.storage[STORAGE_AREA].set({
            [KEY_SHEET_ID]: spreadsheet.id,
            [KEY_SHEET_SHEET]: spreadsheet.sheet
        })
    },

    getSpreadsheet(callback) {
        chrome.storage[STORAGE_AREA].get([KEY_SHEET_ID, KEY_SHEET_SHEET], (data) => {
            callback({
                id: data[KEY_SHEET_ID],
                sheet: data[KEY_SHEET_SHEET]
            })
        })
    },

    addListener(listener) {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === STORAGE_AREA) {
                for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
                    // console.log(
                    //     `Storage key "${key}" in namespace "${namespace}" changed.`,
                    //     `Old value was "${oldValue}", new value is "${newValue}".`
                    // )
                    listener(key, newValue)
                }
            }
        })
    }
}

chrome.storage[STORAGE_AREA].clear()

settings.setSpreadsheet({
    id: "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
    sheet: "en-ru"
    // sheet: "pt-ru"
})