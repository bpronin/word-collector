const signInButton = document.getElementById("sign_in_button")
const signOutButton = document.getElementById("sign_out_button")

/**
 *  Sign in the user upon button click.
 */
function onSignInClick() {
    console.log("Signing In...")
    sheets.signIn()
}

/**
 *  Sign out the user upon button click.
 */
function onSignOutClick() {
    console.log("Signing Out...")
    sheets.signOut()
}

/**
 *  Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
 */
function onSignInStatusChanged(isSignedIn) {
    if (isSignedIn) {
        // signInButton.style.display = "none";
        // signOutButton.style.display = "block";
        console.log("Signed In")
    } else {
        // signInButton.style.display = "block";
        // signOutButton.style.display = "none";
        console.log("Signed Out")
    }
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function onLoad() {
    sheets.setup(onSignInStatusChanged)
}

window.addEventListener("load", onLoad)
signInButton.addEventListener("click", onSignInClick)
signOutButton.addEventListener("click", onSignOutClick)

document.getElementById("get_button").addEventListener("click", () => {
    sheets.values((data) => {
        console.log("Data:" + data.values.length)
    })
})

document.getElementById("put_button").addEventListener("click", () => {
    sheets.append("sample text")
})