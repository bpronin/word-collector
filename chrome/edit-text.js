function showEditFrame(left, top, text) {
    const $frame = document.createElement('iframe')
    document.body.appendChild($frame)

    $frame.id = 'edit-frame'
    $frame.src = 'edit-frame.html'
    $frame.style.width = '400px'
    $frame.style.height = '160px'
    $frame.style.border = 'none'
    $frame.style.left = left
    $frame.style.top = top
    $frame.style.position = 'absolute'
    $frame.style.display = 'block'
    $frame.onload = () => initEditFrame(text)

    console.log("Frame open")
}

function initEditFrame(text) {
    const $frame = document.getElementById('edit-frame')
    $frame.contentWindow.postMessage({
        action: 'init-edit-frame',
        text: text,
        translation: ''
    }, '*')

    console.log("Frame init")
}

function closeEditFrame() {
    const $frame = document.getElementById('edit-frame')
    if ($frame) {
        document.body.removeChild($frame)

        console.log("Frame closed")
    }
}

document.addEventListener('click', async (event) => {
    closeEditFrame()
})

window.addEventListener('message', event => {
    console.log("Received:" + JSON.stringify(event.data))

    if (event.data.action === 'close-edit-frame') {
        closeEditFrame()
        if (event.data.result === 'ok') {
            // chrome.runtime.sendMessage({
            //     action: 'edit-translation-complete',
            //     data: {
            //         text: event.data.text,
            //         translation: event.data.translation
            //     }
            // })

            console.log("Sent to chrome")
        }
    }
})

chrome.storage.local.get('edit_translation_params', data => {
    const params = data.edit_translation_params
    console.log("Params:" + JSON.stringify(params))

    showEditFrame(params.left, params.top, params.text)
})
