const $textEditor = $('text_editor')
const $translationEditor = $('translation_editor')

async function onOkClick() {
    window.parent.postMessage({
        target: 'word-collector',
        action: 'close-edit-frame',
        result: 'ok',
        text: $textEditor.value,
        translation: $translationEditor.value
    }, '*')

    console.log("Sent message to parent")
}

async function onCancelClick() {
    window.parent.postMessage({
        target: 'word-collector',
        action: 'close-edit-frame',
        result: 'cancel'
    }, '*')
}

window.addEventListener('message', event => {
    if (event.data.target === 'word-collector') {
        console.log("Received message:" + JSON.stringify(event.data))

        if (event.data.action === 'init-edit-frame') {
            $textEditor.value = event.data.text || ''
            $translationEditor.value = event.data.translation || ''
        }
    }
})

localizeHtml()
$('ok_button').addEventListener('click', onOkClick)
$('cancel_button').addEventListener('click', onCancelClick)
$translationEditor.focus()
