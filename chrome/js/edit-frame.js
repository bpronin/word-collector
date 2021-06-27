const $textEditor = $('text_editor')
const $translationEditor = $('translation_editor')

function onOkClick() {
    window.parent.postMessage({
        target: 'word-collector',
        action: 'close-edit-frame',
        result: 'ok',
        text: $textEditor.value,
        translation: $translationEditor.value
    }, '*')

    console.log("Sent ok message")
}

function onCancelClick() {
    window.parent.postMessage({
        target: 'word-collector',
        action: 'close-edit-frame',
        result: 'cancel'
    }, '*')

    console.log("Sent cancel message")
}

window.addEventListener('message', async (event) => {
    if (event.data.target === 'word-collector') {
        console.log("Received message:" + JSON.stringify(event.data))

        if (event.data.action === 'init-edit-frame') {
            $textEditor.value = event.data.text || ''
            $translationEditor.value = event.data.translation || ''
        }
    }
})

localizeHtml()
$('ok_button').addEventListener('click', async () => onOkClick())
$('cancel_button').addEventListener('click', async () => onCancelClick())
$translationEditor.focus()
