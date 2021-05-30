/**
 * Stubs for Chrome extension APIs that aren't available to
 * regular web pages, to allow tests to run.
 */

let chrome = chrome || {
    contextMenus: {
        create: function () {
        },
        onClicked: {
            addListener: function () {
            }
        }
    },
    tabs: {
        query: function () {
        },
        update: function () {
        },
        create: function () {
        },
        sendMessage: function () {
        }
    },
    runtime: {
        getURL: function () {
        },
        onInstalled: function () {
        },
        onMessage: function () {
        },
        sendMessage: function () {
        }
    },
    storage: {
        local: {
            get: function () {
            },
            set: function () {
            }
        },
        sync: {
            get: function () {
            },
            set: function () {
            }
        }
    },
    extension: {
        getBackgroundPage: function () {
        }
    }
}
