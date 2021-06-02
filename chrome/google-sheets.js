const API_KEY = "AIzaSyCZStNvDstH0sddbbVbFpmj6CaGPRGKkIg";

sheets = {
    internal: {
        onSignInStatusChanged: undefined,

        sendRequest(method, path, params, data, onResponse) {

            function doRequest(token) {
                if (!token) {
                    throw ("Token is undefined")
                }

                let input = "https://sheets.googleapis.com/v4/spreadsheets/" + path + "?key=" + API_KEY;
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

            sheets.authenticate(false, doRequest);
        }
    },

    /**
     *  Initializes the API client library and sets up sign-in state listeners.
     */
    setup(onSignInStatusChanged) {
        sheets.internal.onSignInStatusChanged = onSignInStatusChanged

        // when this listener is calling ?
        chrome.identity.onSignInChanged.addListener((account, token) => {
            console.log("Google sheets onSignInChanged: " + token)
        })

        console.log("Google sheets initialized")
    },

    authenticate(interactive, onToken) {
        chrome.identity.getAuthToken({interactive: interactive}, token => {
            if (onToken) onToken(token)
            sheets.internal.onSignInStatusChanged(token !== undefined)
        })
    },

    signIn() {

        function doSignIn(token) {
            if (!token) {
                console.log("Signing in...")

                sheets.authenticate(true, () => {
                    console.log("Token obtained");
                });
            } else {
                console.log("Using cached token");
            }
        }

        sheets.authenticate(false, doSignIn)
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

        sheets.authenticate(false, doSignOut);
    },

    getSpreadsheet(spreadsheet, onData) {
        sheets.internal.sendRequest("GET",
            spreadsheet.id,
            undefined,
            undefined,
            onData)
    },

    getValues(spreadsheet, onData) {
        sheets.internal.sendRequest("GET",
            spreadsheet.id + "/values/" + spreadsheet.sheet,
            undefined,
            undefined,
            onData)
    },

    appendValue(spreadsheet, value) {
        sheets.internal.sendRequest("POST",
            spreadsheet.id + "/values/" + spreadsheet.sheet + ":append",
            "&valueInputOption=USER_ENTERED",
            {values: [[value]]}
        )
    }

}
