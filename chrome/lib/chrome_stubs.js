/**
 * Stubs for Chrome extension APIs that aren't available to
 * regular web pages, to allow tests to run.
 */

let chrome = chrome || {
    contextMenus: {
        create() {
        },
        removeAll() {
        },
        onClicked: {
            addListener() {
            }
        }
    },
    tabs: {
        query() {
        },
        update() {
        },
        create() {
        },
        sendMessage() {
        }
    },
    runtime: {
        onInstalled: {
            addListener() {
            }
        },
        getURL() {
        },
        onMessage() {
        },
        sendMessage() {
        }
    },
    storage: {
        local: {
            get() {
            },
            set() {
            }
        },
        sync: {
            get() {
            },
            set() {
            }
        }
    },
    extension: {
        getBackgroundPage() {
        }
    }
}
