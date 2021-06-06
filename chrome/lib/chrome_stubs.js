// noinspection JSUnusedGlobalSymbols

/**
 * Stubs for Chrome extension APIs that aren't available to
 * regular web pages, to allow tests to run.
 */

let chrome = chrome || {
    identity: {
        getAuthToken() {
        },
        removeCachedAuthToken() {

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

menuInfo = {
    menuItemId: {},
    selectionText: {}
}

spreadsheetInfo = {
    spreadsheetId: "",
    properties: {
        title: "",
        locale: "",
        autoRecalc: "",
        timeZone: "",
        defaultFormat: {},
        spreadsheetTheme: {}
    },
    sheets: [
        {
            properties: {
                sheetId: 0,
                title: "",
                index: 0,
                sheetType: "",
                gridProperties: {
                    rowCount: 0,
                    columnCount: 0
                }
            }
        }
    ],
    spreadsheetUrl: ""
}