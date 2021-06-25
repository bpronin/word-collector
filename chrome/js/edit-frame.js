const $textEditor = element('text_editor')
const $translationEditor = element('translation_editor')

function onOkClick() {
    window.parent.postMessage({
        target: 'word-collector',
        action: 'close-edit-frame',
        result: 'ok',
        text: $textEditor.value,
        translation: $translationEditor.value
    }, '*')

    console.log("Sent message to parent")
}

function onCancelClick() {
    window.parent.postMessage({
        target: 'word-collector',
        action: 'close-edit-frame',
        result: 'cancel'
    }, '*')
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
element('ok_button').addEventListener('click', async () => onOkClick())
element('cancel_button').addEventListener('click', async () => onCancelClick)
$translationEditor.focus()
