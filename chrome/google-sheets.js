// Client ID and API key from the Developer Console
const CLIENT_ID = '969392774646-lbqtov56l972akmt5srulp1dhga6pked.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCZStNvDstH0sddbbVbFpmj6CaGPRGKkIg';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

/**
 *  Initializes the API client library and sets up sign-in state listeners.
 */
function googleSheetsInit(onStatusChanged) {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            const signInStatus = gapi.auth2.getAuthInstance().isSignedIn;
            signInStatus.listen(onStatusChanged);
            onStatusChanged(signInStatus.get());
        }, error => {
            console.error(JSON.stringify(error, null, 2));
        });
    })
}

function googleSheetsSignIn() {
    gapi.auth2.getAuthInstance().signIn();
}

function googleSheetsSignOut() {
    gapi.auth2.getAuthInstance().signOut();
}
