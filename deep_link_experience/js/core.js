// Description: Core functions for the deep link experience template.
// Variables

const appetizeIframeName = '#appetize';
const appActionsContainer = document.getElementById('appActions');
const customDeepLinkInput = document.getElementById('customDeepLink');
const launchCustomDeepLinkButton = document.getElementById('launchCustomDeepLink');

let selection = {
    app: function () {
        return config.android;
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
 * Initializes the deep link buttons and selects the first one.
 */
async function initDeepLinks() {
    const deepLinkActions = config.deepLinks.map((deepLinkConfig, i) => {
        const button = createButton(deepLinkConfig.name, () => selectDeepLink(button, i));
        button.classList.add("deepLinkButton");
        button.disabled = true;
        return button;
    });

    appActionsContainer.replaceChildren(...deepLinkActions);
    setDeepLinkButtonsEnabled(false);
}

/**
 * Initializes the client and adds the session event listener.
 * @param sessionConfig The session configuration to use.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient(sessionConfig) {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName, sessionConfig);
        console.log('client loaded!');
        window.client.on("session", async session => {
            console.log('session started!')
            try {
                window.session = session;
                // Enable deep link buttons when session is active
                setDeepLinkButtonsEnabled(true);
            } catch (error) {
                console.error(error);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

/**
 * Initializes the custom deep link input handler.
 */
function initCustomDeepLinkInput() {
    launchCustomDeepLinkButton.addEventListener('click', async function () {
        const customDeepLink = customDeepLinkInput.value.trim();
        if (customDeepLink) {
            await launchCustomDeepLink(customDeepLink);
        }
    });

    customDeepLinkInput.addEventListener('keypress', async function (e) {
        if (e.key === 'Enter') {
            const customDeepLink = customDeepLinkInput.value.trim();
            if (customDeepLink) {
                await launchCustomDeepLink(customDeepLink);
            }
        }
    });
}

// Event Handlers

/**
 * Selects the deep link at the given index and opens it using openUrl.
 * @param index The index of the deep link to select.
 */
async function selectDeepLink(button, index) {
    if (!window.session) {
        console.log('Session not available yet');
        return;
    }

    const deepLinkConfig = config.deepLinks[index];
    const deepLink = deepLinkConfig.deepLink;

    console.log(`Opening deep link: ${deepLink} for ${deepLinkConfig.name}`);
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${originalText}`;
    button.disabled = true;
    try {
        // Use openUrl method to launch the deep link
        await window.session.openUrl(deepLink);
    } catch (error) {
        console.error('Error opening deep link:', error);
    } finally {
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
}

/**
 * Launches a custom deep link entered by the user using openUrl.
 * @param deepLink The custom deep link to launch.
 */
async function launchCustomDeepLink(deepLink) {
    if (!window.session) {
        console.log('Session not available yet');
        return;
    }

    console.log(`Opening custom deep link: ${deepLink}`);

    try {
        // Use openUrl method to launch the deep link
        await window.session.openUrl(deepLink);
    } catch (error) {
        console.error('Error opening custom deep link:', error);
    }
}

/**
 * Updates the session with the selected app.
 * @returns {Promise<void>} A promise that resolves when the session is updated.
 */
async function updateSession() {
    try {
        const selectedApp = selection.app();
        const iFrame = document.querySelector(appetizeIframeName);

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
            record: true,
        };

        if (!window.client) {
            await initClient(sessionConfig);
        }

        console.log(`Starting session with ${selectedApp.publicKey}`);
        const session = await window.client.startSession(sessionConfig);
        console.log(session);
    } catch (error) {
        console.error(error);
    }
}


// Helper Functions

/**
 * Creates a button with the given text and onClick function.
 * @param text The text to display on the button
 * @param onClick The function to call when the button is clicked
 * @returns {HTMLButtonElement} The button element.
 */
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button')
    button.onclick = onClick;
    button.setAttribute('class', 'btn btn-primary material-button');
    button.innerText = text;
    return button;
}

/**
 * Enables or disables all deep link buttons and the custom deep link input.
 * @param enabled Whether the buttons should be enabled.
 */
function setDeepLinkButtonsEnabled(enabled) {
    const allDeepLinkButtons = document.querySelectorAll('.deepLinkButton');
    allDeepLinkButtons.forEach(button => {
        button.disabled = !enabled;
    });

    // Also enable/disable custom deep link input and button
    customDeepLinkInput.disabled = !enabled;
    launchCustomDeepLinkButton.disabled = !enabled;
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    initCustomDeepLinkInput();
    await initDeepLinks();
    await updateSession()
});
