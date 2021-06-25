function showFrame(left, top, text) {
    const $frame = createElement(document.body, 'iframe')

    $frame.id = 'edit-frame'
    $frame.src = chrome.runtime.getURL('edit-frame.html')
    $frame.style.width = frameWidth + 'px'
    $frame.style.height = frameHeight + 'px'
    $frame.style.border = 'none'
    $frame.style.left = left
    $frame.style.top = top
    $frame.style.position = 'absolute'
    $frame.style['box-shadow'] = 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
    $frame.onload = () => initFrame(text)

    console.log("Frame open")
}

function initFrame(text) {
    const $frame = element('edit-frame')
    $frame.contentWindow.postMessage({
        target: 'word-collector',
        action: 'init-edit-frame',
        text: text,
        translation: ''
    }, '*')

    console.log("Frame init")
}

function closeFrame() {
    const $frame = element('edit-frame')
    if ($frame) {
        document.body.removeChild($frame)

        console.log("Frame closed")
    }
}

function startEdit() {
    let selection = window.getSelection()
    if (selection.rangeCount > 0) {
        let left = (window.innerWidth - frameWidth) / 2 + window.scrollX
        let top = (window.innerHeight - frameHeight) / 2 + window.scrollY

        showFrame(left + 'px', top + 'px', selection.toString())
    } else {
        console.log('No selection')
    }
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
    initialized = true
    frameWidth = 400
    frameHeight = 160 /* should be the same as body height in frame's html */

    window.addEventListener('click', async () => closeFrame())

    window.addEventListener('message', async (event) => {
        if (event.data.target === 'word-collector') {
            console.log("Received message:" + JSON.stringify(event.data))

            if (event.data.action === 'close-edit-frame') {
                closeFrame()
                if (event.data.result === 'ok') {
                    endEdit(event.data)
                } else {
                    console.log("Edit canceled")
                }
            }
        }
    })

    console.log("Init")
}

startEdit()
