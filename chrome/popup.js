const OPTIONS_PAGE_URL = chrome.runtime.getURL("options.html")

// let DICTIONARY_PATH  = "default"
//
// settings.get("dictionary_path", value => {
//     DICTIONARY_PATH = value
// });

function signIn() {
    settings.getDataPath(value => {
        window.alert(value)
    });

    // window.alert(DICTIONARY_PATH)
    // console.log("Signing In...");
    // browseFile()
    //     .then((f) => {
    //     // console.log(f);
    //     window.alert(f)
    // });
    // googleSheetsSignIn();

}

async function browseFile() {
    const handle = await window.showOpenFilePicker();
    if (!handle) {
        // User cancelled, or otherwise failed to open a file.
        return;
    }

    // Check if handle exists inside directory our directory handle
    const relativePaths = await directoryHandle.resolve(handle);

    if (relativePaths === null) {
        // Not inside directory handle
    } else {
        // relativePath is an array of names, giving the relative path

        for (const name of relativePaths) {
            // log each entry
            window.alert(name)
        }
    }

    // let fileHandle;
    // [fileHandle] = await window.showOpenFilePicker();
    // const fileData = await fileHandle.getFile();
    // return fileData;
}

let settingsButton = document.getElementById("settings_button");
let signInButton = document.getElementById("sign_in_button");

settingsButton.addEventListener("click", async () => chromeOpenTab(OPTIONS_PAGE_URL))
signInButton.addEventListener("click", async () => signIn())
