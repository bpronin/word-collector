function showFrame(left, top, text) {
    const $frame = document.createElement('iframe')
    document.body.appendChild($frame)

    $frame.id = 'edit-frame'
    // $frame.src = chrome.runtime.getURL('edit-frame.html')
    // put pure html instead of file. i.e. $('#some-id').contents().find('html').html("some-html")
    $frame.src = 'edit-frame.html'
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
    const $frame = document.getElementById('edit-frame')
    $frame.contentWindow.postMessage({
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
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        let left = rect.left;
        if (left + frameWidth > window.innerWidth) left -= frameWidth
        if (left < 0) left = 0

        let top = rect.bottom;
        if (top + frameHeight > window.innerHeight) top -= frameHeight
        if (top < 0) top = 0

        showFrame(left + 'px', top + 'px', range.toString())
    }
}

function endEdit(data) {
    // chrome.runtime.sendMessage({
    //     action: 'edit-translation-complete',
    //     data: {
    //         text: data.text,
    //         translation: data.translation
    //     }
    // })

    console.log("Sent to chrome:" + JSON.stringify(data))
}

/* check that script have already been injected */
if (typeof initialized === 'undefined') {
    frameWidth = 400
    frameHeight = 160 /* should be the same as body height in frame's html */

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
    initialized = true

    console.log("Init")
}

startEdit()
