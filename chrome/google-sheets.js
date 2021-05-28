const API_KEY = "AIzaSyCZStNvDstH0sddbbVbFpmj6CaGPRGKkIg";
const SPREADSEET_HOST = "https://sheets.googleapis.com/v4/spreadsheets/";
let SPREADSHEET_ID = "1-hrhHEqa9-eVIkTV4yU9TJ0EaTLYhiZExY7OZwNGGQY";
let SPREADSHEET_RANGE = "en-ru";

sheets = {
    private: {
        signInCallback: undefined,

        getAuthToken: function (onToken) {
            chrome.identity.getAuthToken(token => {
                if (token) {
                    onToken(token);
                }
            })
        },

        request: function (onData) {

            function doRequest(token) {
                const url = SPREADSEET_HOST + SPREADSHEET_ID + "/values/" + SPREADSHEET_RANGE;
                fetch(
                    url + "?key=" + API_KEY, {
                        method: "GET",
                        async: true,
                        headers: {
                            "Authorization": "Bearer " + token,
                            "Content-Type": "application/json"
                        },
                        "contentType": "json"
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

            sheets.private.getAuthToken(doRequest);
        }
    },

    /**
     *  Initializes the API client library and sets up sign-in state listeners.
     */
    setup: function (onSignInStatusChanged) {
        sheets.private.signInCallback = onSignInStatusChanged
        // chrome.identity.onSignInChanged.addListener(onSignInStatusChanged)

        console.log("Google sheets initialized")
    },

    signIn: function () {
        chrome.identity.getAuthToken({interactive: true}, () => {
            console.log("Token obtained");

            sheets.private.signInCallback(true)
        })
    },

    signOut: function () {

        function doSignOut(token) {
            chrome.identity.removeCachedAuthToken({token: token}, () => {
                console.log("Token removed from cache");
            });

            window.fetch("https://accounts.google.com/o/oauth2/revoke?token=" + token)
                .then(response => {
                        if (response.ok) {
                            console.log("Token revoked");

                            sheets.private.signInCallback(false)
                        }
                    }
                )
        }

        sheets.private.getAuthToken(doSignOut);
    },

    values: function (onData) {
        sheets.private.request(onData)
    }

}
