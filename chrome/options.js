const signInButton = document.getElementById('authorize_button');
const signOutButton = document.getElementById('signout_button');
const label = document.getElementById('path_label');

signInButton.addEventListener("click", onSignInClick);
signOutButton.addEventListener("click", onSignOutClick);
window.addEventListener('load', onGoogleApiLoad)

settings.getDataPath(value => {
    label.innerHTML = value
});


/**
 *  Sign in the user upon button click.
 */
function onSignInClick(event) {
    console.log("Signing In...")
    // googleSheetsSignIn();
}

/**
 *  Sign out the user upon button click.
 */
function onSignOutClick(event) {
    console.log("Signing Out...")
    // googleSheetsSignOut();
}

/**
 *  Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        // signInButton.style.display = 'none';
        // signOutButton.style.display = 'block';
        console.log("Signed In");
    } else {
        // signInButton.style.display = 'block';
        // signOutButton.style.display = 'none';
        console.log("Signed Out");
    }
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function onGoogleApiLoad() {
    console.log("Loading Google API...")
    // googleSheetsInit(updateSigninStatus);
}
