/**
 * Stubs for Chrome extension APIs that aren't available to
 * regular web pages, to allow tests to run.
 */

let chrome = chrome || {
    contextMenus: {
        create: () => {
        },
        onClicked: {
            addListener: () => {
            }
        }
    },
    tabs: {
        query: () => {
        },
        update: () => {
        },
        create: () => {
        }
    },
    runtime: {
        getURL: () => {
        }
    },
    storage: {
        local: {
            get: (arg) => {
                console.log("GET: " + arg)
            },
            set: (arg) => {
                console.log("SET: " + arg)
            }
        },
        sync: {
            get: () => {
            },
            set: () => {
            }
        }
    },
    extension: {
        getBackgroundPage: () => {

        }
    }
}
