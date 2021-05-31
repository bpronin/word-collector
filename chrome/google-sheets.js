const API_KEY = "AIzaSyCZStNvDstH0sddbbVbFpmj6CaGPRGKkIg";

sheets = {
    internal: {
        onSignInStatusChanged: undefined,

        sendRequest: function (method, path, params, data, onResponse) {

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
                                    onResponse(data)
                                })
                        } else {
                            throw ("Request rejected: " + response.status)
                        }
                    })
            }

            sheets.authenticate(false, doRequest);
        }
    },

    sheet: undefined,

    /**
     *  Initializes the API client library and sets up sign-in state listeners.
     */
    setup: function (onSignInStatusChanged) {
        sheets.internal.onSignInStatusChanged = onSignInStatusChanged

        // when this listener is calling ?
        chrome.identity.onSignInChanged.addListener((account, token) => {
            console.log("Google sheets onSignInChanged: " + token)
        })

        console.log("Google sheets initialized")
    },

    authenticate: function (interactive, onToken = noop) {
        chrome.identity.getAuthToken({interactive: interactive}, token => {
            onToken(token);
            sheets.internal.onSignInStatusChanged(token !== undefined)
        })
    },

    signIn: function () {

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

    signOut: function () {

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

    values: function (onData) {
        sheets.internal.sendRequest("GET",
            sheets.sheet.sheet_id + "/values/" + sheets.sheet.sheet_range,
            undefined,
            undefined,
            onData)
    },

    append: function (value) {
        sheets.internal.sendRequest("POST",
            sheets.sheet.sheet_id + "/values/" + sheets.sheet.sheet_range + ":append",
            "&valueInputOption=USER_ENTERED",
            {values: [[value]]},
            noop
        )
    }

}
