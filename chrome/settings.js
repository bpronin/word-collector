const settings = {
    storage: chrome.storage.sync,

    setSheet: (sheet) => {
        settings.storage.set(sheet);
    },

    getSheet(callback) {
        settings.storage.get(["sheet_id", "sheet_range"], callback);
    }
}

settings.storage.clear()
settings.setSheet({
    sheet_id: "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY",
    sheet_range: "en-ru"
})