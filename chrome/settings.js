const STORAGE_AREA = "sync"

const settings = {

    setSpreadsheet(sheet) {
        chrome.storage[STORAGE_AREA].set(sheet)
    },

    getSpreadsheet(callback) {
        chrome.storage[STORAGE_AREA].get(["spreadsheet_id", "spreadsheet_sheet"], callback)
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
    "spreadsheet_id": "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
    "spreadsheet_sheet": "en-ru"
    // "spreadsheet_sheet": "pt-ru"
})