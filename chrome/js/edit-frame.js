const $textEditor = document.getElementById('text_editor')
const $translationEditor = document.getElementById('translation_editor')

async function onOkClick() {
    window.parent.postMessage({
        action: 'close-edit-frame',
        result: 'ok',
        text: $textEditor.value,
        translation: $translationEditor.value
    }, '*')
}

async function onCancelClick() {
    window.parent.postMessage({
        action: 'close-edit-frame',
        result: 'cancel'
    }, '*')
}

window.addEventListener('message', event => {
    if (event.data.action === 'init-edit-frame') {
        $textEditor.value = event.data.text || ''
        $translationEditor.value = event.data.translation || ''
    }
})
document.getElementById('ok_button').addEventListener('click', onOkClick)
document.getElementById('cancel_button').addEventListener('click', onCancelClick)
$translationEditor.focus()
