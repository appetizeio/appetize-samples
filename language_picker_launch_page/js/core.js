// Description: Core functions for the launch template.
// Variables

const appetizeIframeName = '#appetize';
const appActionsContainer = document.getElementById('appActions');
const languageButton = document.getElementById('languageButton');

let selection = {
    product: null,
    language: null
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


// function that set up a language selector dropdown menu for all the languages specified in the config.js
async function initLanguageSelector() {
    // Updates languageButton dropdown with menu items for all languages
    const languageDropdown = document.getElementById('languageButtonContent');
    config.languages.forEach(language => {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.text = language.name;
        option.value = language.code;
        languageDropdown.appendChild(option);
    });
    selectLanguage(0);
}

function selectLanguage(index) {
    const language = config.languages[index];
    if (selection.language === language) {
        console.log(`Already selected ${language.name}`)
        return;
    }

    console.log(`Selecting language ${language.name}`);
    selection.language = language;
    languageButton.innerText = language.name;
    if (window.session) {
        window.session.setLanguage(language.code);
    } else {
        updateSession();
    }
}

/**
 * Observes changes to the language dropdown and updates the session when a new language is selected.
 */
function observeLanguageChanges() {
    try {
        const languageDropdown = document.getElementById('languageButton');
        languageDropdown.addEventListener('hide.bs.dropdown', async event => {

            if (event && event.clickEvent && event.clickEvent.target) {
                let target = findDropdownItem(event.clickEvent.target);
                if (!target) {
                    return;
                }

                if (target && target.classList.contains("inactive")) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                const selectedLanguage = target.value;
                const index = config.languages.findIndex(language => language.code === selectedLanguage);
                await selectLanguage(index);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

/**
 * Finds the closest dropdown item that was clicked.
 * @param element The element that was clicked.
 * @returns {element|null} The dropdown item that was clicked or null.
 */
function findDropdownItem(element) {
    try {
        while (element) {
            if (element.classList?.contains("dropdown-item")) {
                return element;
            }
            element = element.parentNode;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Initializes the client and adds the session event listener.
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
        const selectedApp = selection.product;
        const iFrame = document.querySelector(appetizeIframeName);

        if (!selectedApp) {
            console.log(`No app available.`);
            iFrame.src = "about:blank";
            return;
        }

        const sessionConfig = {
            publicKey: selectedApp.publicKey,
            device: selectedApp.device,
            osVersion: selectedApp.osVersion,
            orientation: selectedApp.orientation,
            centered: 'both',
            scale: 'auto',
            grantPermissions: true,
            toast: config.toast,
            launchUrl: selectedApp.url,
            record: true,
            language: selection.language.code
        };

        //adjust iframe width
        iFrame.width = selectedApp.width;

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
 * Runs any custom actions for the selected app if they exist.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function runCustomActions(session) {
    const selectedApp = selection.product;
    if (typeof (selectedApp.customActions) == 'undefined') {
        console.log(`No custom actions set for ${selectedApp.publicKey}`)
        return;
    }

    console.log(`Running custom actions for ${selectedApp.publicKey}`)
    await selectedApp.customActions(window.client, session, selection.language.code);
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
    await initProducts();
    await initLanguageSelector();
    observeLanguageChanges();
    await updateSession()
});