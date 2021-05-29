const API_KEY = "AIzaSyCZStNvDstH0sddbbVbFpmj6CaGPRGKkIg";
const SPREADSEET_HOST = "https://sheets.googleapis.com/v4/spreadsheets/";
let SPREADSHEET_ID = "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY";
let SPREADSHEET_RANGE = "en-ru";

sheets = {
    internal: {
        onSignInStatusChanged: undefined,

        requestGet: function (onData) {

            function doRequest(token) {
                if (token) {
                    const url = SPREADSEET_HOST + SPREADSHEET_ID + "/values/" + SPREADSHEET_RANGE + "?";
                    fetch(
                        url + "key=" + API_KEY, {
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer " + token,
                                "Content-Type": "application/json"
                            },
                            contentType: "json",
                            async: true
                        })
                        .then(response => {
                            if (response.ok) {
                                response.json()
                                    .then(data => {
                                        onData(data)
                                    })
                            }
                        })
                }
            }

            sheets.authenticate(false, doRequest);
        },

        requestPost: function (data) {

            function doRequest(token) {
                if (token) {
                    const url = SPREADSEET_HOST + SPREADSHEET_ID + "/values/" + SPREADSHEET_RANGE + ":append" +
                        "?valueInputOption=USER_ENTERED&";
                    fetch(
                        url + "key=" + API_KEY, {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer " + token,
                                "Content-Type": "application/json"
                            },
                            contentType: "json",
                            body: JSON.stringify(data),
                            async: true
                        })
                        .then(response => {
                            if (response.ok) {
                                console.log("Request accepted")
                            }
                        })
                }
            }

            sheets.authenticate(false, doRequest);
        }
    },

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

    authenticate: function (interactive, onToken) {
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

                window.fetch("https://accounts.google.com/o/oauth2/revoke?token=" + token)
                    .then(response => {
                            if (response.ok) {
                                console.log("Token revoked");
                            }
                        }
                    )
            }
        }

        sheets.internal.authenticate(false, doSignOut);
    },

    values: function (onData) {
        sheets.internal.requestGet(onData)
    },

    append: function (value) {
        sheets.internal.requestPost({values: [[value]]})
    }

}
