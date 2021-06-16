chrome.storage.local.get(['last_selected_text'], params => {

    let text = params.last_selected_text
    let translation = '[translation of text]'

    chrome.runtime.sendMessage({
        action: 'edit-translation-complete',
        data: {
            text: text,
            translation: translation
        }
    })
})
