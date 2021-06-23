function showFrame(left, top, text) {
    const $frame = document.createElement('iframe')
    document.body.appendChild($frame)

    $frame.id = 'edit-frame'
    // $frame.src = chrome.runtime.getURL('edit-frame.html')
    // put pure html instead of file. i.e. $('#some-id').contents().find('html').html("some-html")
    $frame.src = 'edit-frame.html'
    $frame.style.width = '400px'
    $frame.style.border = 'none'
    $frame.style.left = left
    $frame.style.top = top
    $frame.style.position = 'absolute'
    $frame.style['box-shadow'] = 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
    $frame.onload = () => initFrame(text)

    console.log("Frame open")
}

function initFrame(text) {
    const $frame = document.getElementById('edit-frame')
    const frameWindow = $frame.contentWindow;
    $frame.style.height = frameWindow.document.body.scrollHeight + 'px'
    frameWindow.postMessage({
        action: 'init-edit-frame',
        text: text,
        translation: ''
    }, '*')

    console.log("Frame init")
}

function closeFrame() {
    const $frame = document.getElementById('edit-frame')
    if ($frame) {
        document.body.removeChild($frame)

        console.log("Frame closed")
    }
}

function startEdit() {
    chrome.storage.local.get('edit_translation_params', data => {
        const params = data.edit_translation_params
        console.log("Params:" + JSON.stringify(params))

        showFrame(params.left, params.top, params.text)
    })
}

function endEdit(data) {
    chrome.runtime.sendMessage({
        action: 'edit-translation-complete',
        data: {
            text: data.text,
            translation: data.translation
        }
    })

    console.log("Sent to chrome")
}

/* check that script have already been injected */
if (typeof initialized === 'undefined') {
    document.addEventListener('click', async () => {
        closeFrame()
    })

    window.addEventListener('message', async event => {
        console.log("Received message:" + JSON.stringify(event.data))

        if (event.data.action === 'close-edit-frame') {
            closeFrame()
            if (event.data.result === 'ok') {
                endEdit(event.data)
            } else {
                console.log("Edit canceled")
            }
        }
    })

    // chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    //     console.log("Chrome says " + JSON.stringify(request))
    //     sendResponse()
    // })

    initialized = true

    console.log("Init")
}

startEdit()
