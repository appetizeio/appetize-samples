// Description: Core functions for the launch template.
// Variables

const appetizeIframeName = '#appetize';
const platformButtons = document.querySelectorAll('.androidButton, .iosButton');
const appActionsContainer = document.getElementById('appActions');

let selection = {
    platform: "android",
    product: config.products[0],
    app: function () {
        return this.product[this.platform];
    }
}

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
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient() {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName);
        console.log('client loaded!');
        window.client.on("session", async session => {
            console.log('session started!')
            try {
                window.session = session;
                await runCustomActions(session);
            } catch (error) {
                console.error(error);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

// Event Handlers

/**
 * Selects the preferred platform.
 * @param button The platform button that was clicked.
 * @param shouldUpdateSession Whether or not to update the session after selecting the platform.
 */
async function selectPlatform(button, shouldUpdateSession = true) {
    if (typeof button === undefined) {
        console.log(`No platform available for this product.`);
        selection.platform = null;
        return;
    }
    console.log(`selecting platform ${button.text}`);
    selection.platform = button.text.toLowerCase().trim();
    toggleButtonActive(platformButtons, button);
    if (shouldUpdateSession) {
        await updateSession();
    }
}

/**
 * Selects the app at the given index.
 * @param index The index of the app to select.
 * @param shouldUpdateSession Whether or not to update the session after selecting the app.
 */
async function selectApp(index, shouldUpdateSession = true) {
    const product = config.products[index];
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
    const iFrame = document.querySelector(appetizeIframeName);
    const selectedApp = selection.app();

    if (!selectedApp) {
        console.log(`No app available.`);
        iFrame.src = "about:blank";
        return;
    }

    const newUrl = `https://appetize.io/embed/${selectedApp.publicKey}?device=${selectedApp.device}&toast=${config.toast}&scale=auto&centered=both&autoplay=${config.autoPlay}`;

    if (iFrame.src === newUrl) {
        return;
    }

    console.log(`Updating session with ${selectedApp.publicKey}`);
    iFrame.src = newUrl;

    // Wait for the iframe to have a src before initializing client. If we already have a client, don't init again.
    if (window.client) {
        return
    }
    await initClient();
}

/**
 * Determines whether  the selected product has the given platform available and disables any platform buttons that aren't available.
 * @returns {Promise<void>} A promise that resolves when the platform availability has been checked.
 */
async function checkPlatformAvailability() {
    const selectedProduct = selection.product;
    platformButtons.forEach((button) => {
        const platformName = button.text.toLowerCase().trim();
        const isDisabled = !(platformName in selectedProduct);
        console.log(`Checking if ${platformName} is available for ${selectedProduct.publicKey}: ${!isDisabled}`);
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

// Helper Functions

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

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    await initPlatforms();
    await initProducts();
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