const $textEditor = $('text_editor')
const $translationEditor = $('translation_editor')
const $okButton = $('ok_button')
const $cancelButton = $('cancel_button')

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

$cancelButton.addEventListener('click', async () => onCancelClick())
$okButton.addEventListener('click', async () => onOkClick())

window.addEventListener('keyup', async (event) => {
    switch (event.code) {
        case 'Enter':
            event.preventDefault();
            $okButton.click();
            break;
        case 'Escape':
            event.preventDefault();
            $cancelButton.click();
            break;
    }
})

window.addEventListener('message', async (event) => {
    if (event.data.target === 'word-collector') {
        console.log(`Received message: ${JSON.stringify(event.data)}`)

        if (event.data.action === 'init-edit-frame') {
            $textEditor.value = event.data.text || ''
            $translationEditor.value = event.data.translation || ''
        }
    }
})

localizeHtml()
$translationEditor.focus()
