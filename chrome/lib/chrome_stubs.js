/**
 * Stubs for Chrome extension APIs that aren't available to
 * regular web pages, to allow tests to run.
 */

let chrome = chrome || {
    identity: {
        getAuthToken() {
        },
        onSignInChanged: {
            addListener() {
            }
        }
    },
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
        onMessage: {
            addListener() {
            }
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
