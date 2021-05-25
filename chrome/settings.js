const STORAGE = chrome.storage.local;

STORAGE.clear()

const settings = {
    get: (key, callback, defaultValue) => {
        STORAGE.get([key], function (result) {
            let value = result[key]
            if (value === undefined){
                value = defaultValue
                settings.set(key, value)
            }
            callback(value)
        });
    },

    set: (key, value) => {
        STORAGE.set({[key]: value}, function () {
            console.log(key + " value is set to: " + value);
        });
    },

    getDataPath(callback) {
        settings.get("data_path", callback, "default")
    },

    setDataPath(value) {
        settings.set("data_path", value)
    }
}