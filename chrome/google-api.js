const API_KEY = "AIzaSyCZStNvDstH0sddbbVbFpmj6CaGPRGKkIg"

const gapi = {
    internal: {
        onSignInStatusChanged: undefined,

        sendRequest(method, apiUrl, path, params, data, onResponse, onRejected) {

            function doRequest(token) {
                if (!token) {
                    throw ("Token is undefined")
                }

                let input = apiUrl + path + "?key=" + API_KEY;
                if (params) {
                    input += params
                }

                const init = {
                    method: method,
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    contentType: "json",
                    async: true
                }

                if (method === "POST") {
                    init.body = JSON.stringify(data)
                }

                fetch(input, init)
                    .then(response => {
                        if (response.ok) {
                            console.log("Request accepted")

                            response.json()
                                .then(data => {
                                    if (onResponse) {
                                        onResponse(data)
                                    }
                                })
                        } else {
                            console.log("Request rejected")

                            if (onRejected) {
                                onRejected()
                            } else
                                throw ("Request rejected: " + response.status)
                        }
                    })
            }

            gapi.checkLoggedIn(doRequest)
        }
    },

    /**
     *  Initializes the API client library and sets up sign-in state listeners.
     */
    setup(onSignInStatusChanged) {
        gapi.internal.onSignInStatusChanged = onSignInStatusChanged

        // when this listener is calling ?
        chrome.identity.onSignInChanged.addListener((account, token) => {
            console.log("Google API onSignInChanged: " + token)
        })

        console.log("Google API initialized")
    },

    checkLoggedIn(onToken) {
        chrome.identity.getAuthToken({interactive: false}, token => {
            if (onToken) onToken(token)
        })
    },

    login() {

        function doLogin(token) {
            if (!token) {
                console.log("Signing in...")

                chrome.identity.getAuthToken({interactive: true}, () => {
                    console.log("Token obtained")

                    gapi.internal.onSignInStatusChanged(true)
                })
            } else {
                console.log("Using cached token")
            }
        }

        gapi.checkLoggedIn(doLogin)
    },

    logout() {

        function doLogout(token) {
            if (token) {
                gapi.internal.onSignInStatusChanged(false)

                console.log("Signing out...")

                chrome.identity.removeCachedAuthToken({token: token}, () => {
                    console.log("Token removed from cache")
                })

                fetch("https://accounts.google.com/o/oauth2/revoke?token=" + token)
                    .then(response => {
                            if (response.ok) {
                                console.log("Token revoked")
                            }
                        }
                    )
            }
        }

        gapi.checkLoggedIn(doLogout)
    },

    spreadsheets: {
        url: "https://sheets.googleapis.com/v4/spreadsheets/",

        createSpreadsheet(onComplete) {
            gapi.internal.sendRequest("POST",
                gapi.spreadsheets.url,
                "",
                undefined,
                {
                    properties: {
                        title: "words-collector"
                    }
                },
                onComplete)
        },

        getSpreadsheet(spreadsheet, onData) {
            gapi.internal.sendRequest("GET",
                gapi.spreadsheets.url,
                spreadsheet.id,
                undefined,
                undefined,
                onData,
                () => onData(undefined)
            )
        },

        getValues(spreadsheet, onData) {
            gapi.internal.sendRequest("GET",
                gapi.spreadsheets.url,
                spreadsheet.id + "/values/" + spreadsheet.sheet,
                undefined,
                undefined,
                onData)
        },

        appendValue(spreadsheet, value) {
            gapi.internal.sendRequest("POST",
                gapi.spreadsheets.url,
                spreadsheet.id + "/values/" + spreadsheet.sheet + ":append",
                "&valueInputOption=USER_ENTERED",
                {values: [[value]]}
            )
        }
    }

}
