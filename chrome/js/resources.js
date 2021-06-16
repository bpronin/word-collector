/* Localized strings that cannot be loaded be chrome.i18n.getMessage()
    due to asynchronous context (like in background.js) */
const i18n = {
    get(key) {
        const s = i18n[key]
        if (!s) {
            throw 'String resource not found: ' + key
        }
        return s[navigator.language] || s['en']
    },
    save_to_collection: {
        en: 'Save to collection',
        ru: 'Сохранить в коллекции'
    }
}

function R(key) {
    const s = chrome.i18n.getMessage(key);
    if (!s) {
        throw 'String resource not found: ' + key
    }
    return s
}

function localizeHtml() {
    document.querySelectorAll('[i18n]').forEach(element => {
        element.innerText = R(element.attributes.i18n.value)
    })
}
