// Description: Core functions for the launch template.
// Variables

const appetizeIframeName = '#appetize';
const platformButtons = document.querySelectorAll('.androidButton, .iosButton');
const appActionsContainer = document.getElementById('appActions');
const screenshotButton = document.getElementById('btn_screenshot');
const logsButton = document.getElementById('btn_logs');

let selection = {
    platform: null,
    product: null,
    app: function () {
        return this.product[this.platform];
    }
}

let debugLogs = [];
let networkLogs = [];
let playActions = [];

// Init Functions

/**
 * Initializes animations for the page.
 */
function initAnimations() {
    AOS.init({
        easing: 'ease-out-cubic', once: true, offset: 120, duration: 650
    });
}

/**
 * Initializes the app buttons and selects the first one.
 */
async function initProducts() {
    const productActions = config.products.map((product, i) => {
        const button = createButton(product.name, `selectApp(${i});`);
        button.classList.add("productButton");
        return button;
    });

    appActionsContainer.replaceChildren(...productActions);
    await selectApp(0, false);
}

/**
 * Initializes the platform buttons and selects the first one.
 */
async function initPlatforms() {
    platformButtons.forEach((button) => {
        button.addEventListener('click', async function handleClick() {
            await selectPlatform(button);
        });
    });
    await selectPlatform(platformButtons[0], false);
}

/**
 * Initializes the client and adds the session event listener.
 * @param config The configuration for the Appetize client.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient(config) {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName, config);
        console.log('client loaded!');
        window.client.on("session", async session => {
            console.log('session started!')
            try {
                window.session = session;
                setButtonDisabled(screenshotButton, false);
                clearLogs();
                observeLogs(session);
                await runCustomActions(session);
            } catch (error) {
                console.error(error);
            }
        })
        window.client.on("sessionEnded", async () => {
            console.log('session ended!');
            setButtonDisabled(screenshotButton, true);
            window.session = null;
        })
    } catch (error) {
        console.error(error);
    }
}

// Event Handlers

/**
 * Selects the preferred platform if it hasn't been selected already and is available.
 * @param button The platform button that was clicked.
 * @param shouldUpdateSession Whether or not to update the session after selecting the platform.
 */
async function selectPlatform(button, shouldUpdateSession = true) {
    if (typeof button === undefined) {
        console.log(`No platform available for this product.`);
        selection.platform = null;
        return;
    }

    const preferredPlatform = button.text.toLowerCase().trim();
    if (selection.platform === preferredPlatform) {
        console.log(`Already selected ${preferredPlatform}`);
        return;
    }

    console.log(`selecting platform ${preferredPlatform}`);
    selection.platform = preferredPlatform;
    toggleButtonActive(platformButtons, button);
    if (shouldUpdateSession) {
        await updateSession();
    }
}

/**
 * Selects the app at the given index if it hasn't already been selected.
 * @param index The index of the app to select.
 * @param shouldUpdateSession Whether or not to update the session after selecting the app.
 */
async function selectApp(index, shouldUpdateSession = true) {
    const product = config.products[index];
    if (selection.product === product) {
        console.log(`Already selected ${product.name}`)
        return;
    }

    selection.product = product;
    console.log(`Selecting ${product.name}`);

    const allProductButtons = document.querySelectorAll('.productButton');
    toggleButtonActive(allProductButtons, allProductButtons[index]);
    await checkPlatformAvailability();
    if (shouldUpdateSession) {
        await updateSession();
    }
}

/**
 * Updates the session with the selected app.
 * @returns {Promise<void>} A promise that resolves when the client exists.
 */
async function updateSession() {
    try {
        const iFrame = document.querySelector(appetizeIframeName);
        const selectedApp = selection.app();

        if (!selectedApp) {
            console.log(`No app available.`);
            iFrame.src = "about:blank";
            return;
        }

        const sessionConfig = {
            publicKey: selectedApp.publicKey,
            device: selectedApp.device,
            centered: 'both',
            scale: 'auto',
            toast: config.toast,
            launchUrl: selectedApp.url,
            record: true,
            proxy: 'intercept',
            debug: true,
            grantPermissions: true,
        };

        if (!window.client) {
            await initClient(sessionConfig);
        }

        console.log(selection);
        const session = await window.client.setConfig(sessionConfig);
        console.log(session);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Determines whether the selected product has the given platform available and disables any platform buttons that aren't available.
 * @returns {Promise<void>} A promise that resolves when the platform availability has been checked.
 */
async function checkPlatformAvailability() {
    const selectedProduct = selection.product;
    platformButtons.forEach((button) => {
        const platformName = button.text.toLowerCase().trim();
        const isDisabled = !(platformName in selectedProduct);
        console.log(`Checking if ${platformName} is available for ${selectedProduct.name}: ${!isDisabled}`);
        setButtonDisabled(button, isDisabled);
    });

    if (selectedProduct.android)
        await selectPlatform(platformButtons[0]);
    else if (selectedProduct.ios)
        await selectPlatform(platformButtons[1]);
}

/**
 * Runs any custom actions for the selected app if they exist.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function runCustomActions(session) {
    const selectedApp = selection.app();
    if (typeof (selectedApp.customActions) == 'undefined') {
        console.log(`No custom actions set for ${selectedApp.publicKey} on platform ${selection.platform}`)
        return;
    }

    console.log(`Running custom actions for ${selectedApp.publicKey} on platform ${selection.platform}`)
    await selectedApp.customActions(window.client, session);
}

function initScreenshotButton() {
    screenshotButton.addEventListener('click', async () => {
        if (!window.session) {
            console.log('No session available to take a screenshot of.');
            return;
        }

        console.log('Taking screenshot...');
        const screenshot = await window.session.screenshot("base64");
        const filename = `${selection.product.name.toLowerCase()}_${selection.platform.toLowerCase()}_${getFormattedDate()}.jpg`
            .replace(/ /g, '_');
        const blob = base64ToBlob(screenshot.data);
        generateTemporaryLink(blob, filename);
        console.log('Screenshot taken!');
    });
}

function initLogsButton() {
    logsButton.addEventListener('click', async () => {
        console.log('Saving logs...');
        const zip = new JSZip();

        const playActionsBlob = createPlayActionsBlob(playActions);
        zip.file('playActions.json', playActionsBlob);

        const debugLogsBlob = createDebugLogsBlob(debugLogs);
        zip.file('debugLogs.txt', debugLogsBlob);

        const networkLogsBlob = createNetworkLogsBlob(networkLogs);
        zip.file('networkLogs.har', networkLogsBlob);

        const blob = await zip.generateAsync({type: 'blob'});
        const filename = `${selection.product.name.toLowerCase()}_${selection.platform.toLowerCase()}_logs_${getFormattedDate()}.zip`
            .replace(/ /g, '_');
        generateTemporaryLink(blob, filename);
        console.log('Logs saved!');
    });

}

/**
 * Creates a blob from the given play actions.
 * @param playActions The play actions to create a blob from.
 * @returns {Blob} The blob created from the play actions.
 */
function createPlayActionsBlob(playActions) {
    return new Blob([JSON.stringify(playActions, null, 2)], {type: 'text/plain'});
}

/**
 * Creates a blob from the given debug logs.
 * @param debugLogs The debug logs to create a blob from.
 * @returns {Blob} The blob created from the debug logs.
 */
function createDebugLogsBlob(debugLogs) {
    return new Blob([debugLogs.join('\n')], {type: 'application/text'});
}

/**
 * Creates a blob from the given network logs.
 * @param networkLogs The network logs to create a blob from.
 * @returns {Blob} The blob created from the network logs.
 */
function createNetworkLogsBlob(networkLogs) {
    const harFormat = {
        log: {
            version: '1.2',
            creator: {
                name: 'Appetize Intercept Proxy',
                version: '1.0'
            },
            entries: networkLogs.filter((log) => !!(log.response))
        }
    }
    return new Blob([JSON.stringify(harFormat, null, 2)], {type: 'application/text'});
}

/**
 * Generates a temporary link to download the given blob with the given filename.
 * @param blob The blob to generate a temporary link for.
 * @param filename The filename to use for the download.
 */
function generateTemporaryLink(blob, filename) {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    downloadLink.click();
}

/**
 * Clears the debug logs, network logs, and play actions.
 */
function clearLogs() {
    console.log('Clearing logs...');
    debugLogs = [];
    networkLogs = [];
    playActions = [];
    setButtonDisabled(logsButton, true);
}

/**
 * Observes the logs for the given session and adds them to the appropriate log arrays.
 * @param session
 */
function observeLogs(session) {
    console.log('Observing logs...');
    session.on('network', (data) => {
        networkLogs.push(data);
        setButtonDisabled(logsButton, false);
    });
    session.on('log', (data) => {
        debugLogs.push(data.message);
        setButtonDisabled(logsButton, false);
    });
    session.on('action', action => {
        playActions.push(action);
        setButtonDisabled(logsButton, false);
    });
}

// Helper Functions

/**
 * Base64 to Blob function from https://stackoverflow.com/a/16245768/5210
 * @param base64Data The base64 data to convert to a blob.
 * @returns {Blob} The blob created from the base64 data.
 */
function base64ToBlob(base64Data) {
    const parts = base64Data.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

/**
 * Creates a button with the given text and onClick function.
 * @param text The text to display on the button
 * @param onClick The function to call when the button is clicked
 * @returns {HTMLAnchorElement} The button element.
 */
function createButton(text, onClick) {
    const button = document.createElement('a');
    button.setAttribute('onClick', onClick);
    button.setAttribute('class', 'btn btn-primary material-button');
    button.innerText = text;
    return button;
}

/**
 * Toggle the active class on the given button as well as removing it from all other buttons in the group.
 * @param buttonGroup All buttons in the group
 * @param button The button to make active
 */
function toggleButtonActive(buttonGroup, button) {
    if (typeof (buttonGroup) != 'undefined') {
        buttonGroup.forEach((button) => {
            button.classList.remove('active');
        });
    }
    button.classList.add('active');
}

/**
 * Sets the disabled state of the given button.
 * @param button The button to set the disabled state of.
 * @param isDisabled Whether or not the button should be disabled.
 */
function setButtonDisabled(button, isDisabled) {
    if (isDisabled) {
        button.classList.add('disabled');
    } else {
        button.classList.remove('disabled');
    }
}

/**
 * Gets a formatted date string for the current date and time.
 * @returns {string} The formatted date string.
 */
function getFormattedDate() {
    const date = new Date();
    return date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        '-' +
        ('0' + date.getMinutes()).slice(-2) +
        '-' +
        ('0' + date.getSeconds()).slice(-2);
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    await initPlatforms();
    await initProducts();
    initScreenshotButton();
    initLogsButton();
    await new Promise(res => {
        let i = setInterval(() => {
            if (window.appetize.getClient) {
                clearInterval(i)
                res()
            }
        }, 100)
    })
    await updateSession()
});