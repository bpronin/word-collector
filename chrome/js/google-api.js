const API_KEY = '{GOOGLE_API_KEY}'

const gapi = {
    internal: {
        onSignInStatusChanged: undefined,

        sendRequest(method, apiUrl, path, params, body, onResponse, onRejected) {

            function doRequest(token) {
                if (!token) {
                    throw ('Token is undefined')
                }

                let input = apiUrl + (path || '') + '?key=' + API_KEY;
                if (params) {
                    input += params
                }

                const init = {
                    method: method,
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    contentType: 'json',
                    async: true
                }

                if (method === 'POST') {
                    init.body = JSON.stringify(body)
                }

                fetch(input, init)
                    .then(response => {
                        if (response.ok) {
                            // console.log('Request accepted')

                            response.json()
                                .then(data => {
                                    if (onResponse) {
                                        onResponse(data)
                                    }
                                })
                        } else {
                            console.log('Request rejected')

                            if (onRejected) {
                                onRejected()
                            } else
                                throw ('Request rejected: ' + response.status + '. ' + input)
                        }
                    })
            }

            gapi.checkLoggedIn(doRequest)
        },

        batchUpdate(spreadsheetId, requests, onComplete) {
            gapi.internal.sendRequest('POST',
                gapi.spreadsheets.url,
                spreadsheetId + ':batchUpdate',
                undefined,
                requests,
                onComplete
            )
        },

        applyDefaultFormat(info, onComplete) {
            const sheetId = 0
            gapi.internal.batchUpdate(info.spreadsheetId, {
                requests: [{
                    appendCells: {
                        sheetId: sheetId,
                        rows: [{
                            values: [{
                                userEnteredValue: {
                                    stringValue: 'Text'
                                }
                            }, {
                                userEnteredValue: {
                                    stringValue: 'Translation'
                                }
                            }]
                        }],
                        fields: 'userEnteredValue'
                    }
                }, {
                    updateSheetProperties: {
                        properties: {
                            sheetId: sheetId,
                            gridProperties: {
                                frozenRowCount: 1
                            }
                        },
                        fields: 'gridProperties.frozenRowCount'
                    }
                }, {
                    updateDimensionProperties: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'COLUMNS',
                            startIndex: 0,
                            endIndex: 2
                        },
                        properties: {
                            pixelSize: 300
                        },
                        fields: 'pixelSize'
                    }
                }, {
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: 0,
                            endRowIndex: 1
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: {
                                    red: 0.9,
                                    green: 0.9,
                                    blue: 0.9
                                },
                                horizontalAlignment: 'CENTER'
                            }
                        },
                        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment)'
                    }
                }]
            }, onComplete)
        }
    },

    /**
     *  Initializes the API client library and sets up sign-in state listeners.
     */
    setup(onSignInStatusChanged) {
        gapi.internal.onSignInStatusChanged = onSignInStatusChanged

        //todo: when this listener is calling and what for ?
        chrome.identity.onSignInChanged.addListener((account, token) => {
            console.log('Google API onSignInChanged: ' + token)
        })

        console.log('Google API initialized')
    },

    checkLoggedIn(onToken) {
        chrome.identity.getAuthToken({interactive: false}, token => {
            onToken(token)
        })
    },

    login() {

        function doLogin(token) {
            if (!token) {
                console.log('Signing in...')

                chrome.identity.getAuthToken({interactive: true}, () => {
                    console.log('Token obtained')

                    gapi.internal.onSignInStatusChanged(true)
                })
            } else {
                console.log('Using cached token')
            }
        }

        gapi.checkLoggedIn(doLogin)
    },

    logout() {

        function doLogout(token) {
            if (token) {
                gapi.internal.onSignInStatusChanged(false)

                console.log('Signing out...')

                chrome.identity.removeCachedAuthToken({token: token}, () => {
                    console.log('Token removed from cache')
                })

                fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token)
                    .then(response => {
                            if (response.ok) {
                                console.log('Token revoked')
                            }
                        }
                    )
            }
        }

        gapi.checkLoggedIn(doLogout)
    },

    spreadsheets: {
        url: 'https://sheets.googleapis.com/v4/spreadsheets/',

        createSpreadsheet(name, onComplete) {
            gapi.internal.sendRequest('POST',
                gapi.spreadsheets.url,
                undefined,
                undefined,
                {
                    properties: {
                        title: name
                    }
                }, info => {
                    gapi.internal.applyDefaultFormat(info, () => {
                        onComplete(info) /* return create's info not apply's */
                    })
                })
        },

        getSpreadsheet(spreadsheetId, onData) {
            gapi.internal.sendRequest('GET',
                gapi.spreadsheets.url,
                spreadsheetId,
                undefined,
                undefined,
                onData,
                () => onData(undefined)
            )
        },

        getValues(spreadsheetId, range, onData) {
            gapi.internal.sendRequest('GET',
                gapi.spreadsheets.url,
                spreadsheetId + '/values/' + range,
                undefined,
                undefined,
                onData)
        },

        appendValue(spreadsheetId, range, values, onComplete) {
            gapi.internal.sendRequest('POST',
                gapi.spreadsheets.url,
                spreadsheetId + '/values/' + range + ':append',
                '&valueInputOption=USER_ENTERED',
                {values: [values]},
                onComplete
            )
        }
    }

}
