// Description: Core functions for the launch params experience template.

// Variables
const appetizeIframeName = '#appetize';
const colorThemeSelect = document.getElementById('colorTheme');
const skipOnboardingCheckbox = document.getElementById('skipOnboarding');
const launchAppButton = document.getElementById('launchAppButton');

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
            } catch (error) {
                console.error(error);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

/**
 * Initializes the launch button handler.
 */
function initLaunchButton() {
    launchAppButton.onclick = async () => {
        await launchAppWithParams();
    };
}

// Event Handlers

/**
 * Launches the app with the selected parameters.
 */
async function launchAppWithParams() {
    // Get the current values from the UI
    const colorTheme = colorThemeSelect.value;
    const skipOnboarding = skipOnboardingCheckbox.checked;

    // Build the params object
    const params = {
        colorTheme: Number(colorTheme) ?? 0,
        matchSystemTheme: false,
        initialOnboardingEnabled: !skipOnboarding
    };

    console.log('Launching app with params:', params);

    const originalText = launchAppButton.innerHTML;
    launchAppButton.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${originalText}`;
    launchAppButton.disabled = true;

    try {
        // Restart the session with the new params
        console.log('Starting session with params:', params);
        await window.client.startSession({
            params: params
        });

        console.log('App launched with params:', params);
    } catch (error) {
        console.error('Error launching app with params:', error);
    } finally {
        setTimeout(() => {
            launchAppButton.innerHTML = originalText;
            launchAppButton.disabled = false;
        }, 1000);
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
            autoPlay: false
        };

        if (!window.client) {
            await initClient(sessionConfig);
        }

        console.log(`Starting session with ${selectedApp.publicKey}`);
    } catch (error) {
        console.error(error);
    }
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    initLaunchButton();
    await updateSession();
});
