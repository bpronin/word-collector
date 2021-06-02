const gapi = {
    internal: {
        onSignInStatusChanged: undefined,

        sendRequest(method, apiUrl, path, params, data, onResponse) {

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
                                    if (onResponse) onResponse(data)
                                })
                        } else {
                            throw ("Request rejected: " + response.status)
                        }
                    })
            }

            gapi.authenticate(false, doRequest);
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

    authenticate(interactive, onToken) {
        chrome.identity.getAuthToken({interactive: interactive}, token => {
            if (onToken) onToken(token)
            gapi.internal.onSignInStatusChanged(token !== undefined)
        })
    },

    signIn() {

        function doSignIn(token) {
            if (!token) {
                console.log("Signing in...")

                gapi.authenticate(true, () => {
                    console.log("Token obtained");
                });
            } else {
                console.log("Using cached token");
            }
        }

        gapi.authenticate(false, doSignIn)
    },

    signOut() {

        function doSignOut(token) {
            if (token) {
                console.log("Signing out...")

                chrome.identity.removeCachedAuthToken({token: token}, () => {
                    console.log("Token removed from cache");
                });

                fetch("https://accounts.google.com/o/oauth2/revoke?token=" + token)
                    .then(response => {
                            if (response.ok) {
                                console.log("Token revoked");
                            }
                        }
                    )
            }
        }

        gapi.authenticate(false, doSignOut);
    },

    spreadsheets: {
        url: "https://sheets.googleapis.com/v4/spreadsheets/",

        getSpreadsheet(spreadsheet, onData) {
            gapi.internal.sendRequest("GET",
                gapi.spreadsheets.url,
                spreadsheet.id,
                undefined,
                undefined,
                onData)
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
