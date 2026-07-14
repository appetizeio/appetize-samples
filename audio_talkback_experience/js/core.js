// Description: Core functions for the TalkBack experience.
// Variables

const appetizeIframeName = '#appetize';

let selection = {
    platform: config.defaultPlatform,
    publicKey: () => {
        return config.app[selection.platform].publicKey;
    }
};

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
 * @param sessionConfig The configuration to start the client with.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient(sessionConfig) {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName, sessionConfig);
        console.log('client loaded!');
        window.client.on("session", async session => {
            console.log('session started!');
            window.session = session;
            session.on("end", () => {
                console.log('session ended!');
                window.session = null;
            });

            // TalkBack is always enabled at runtime, once the device is ready.
            await enableTalkBack(session);

            // Now that the device is ready, focus the page so key presses are captured and
            // forwarded to the device (see observeKeyboard / focusPage). This must run *after*
            // the device is ready — during startup the embed keeps reclaiming focus, so an
            // earlier focus wouldn't stick.
            focusPage();
        });

        // Start the session automatically (rather than waiting for a "Tap to Play" click).
        console.log('starting session…');
        await window.client.startSession();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Enables the TalkBack screen reader by running the required adb shell commands.
 * Uses the runtime `session.adbShellCommand` method rather than the start-time config flag
 * so the commands run *after* the device is ready (via `waitUntilReady`), giving the system
 * time to boot before the accessibility service is enabled.
 * Each command is run independently so a failure (e.g. uninstalling a package that isn't
 * present) doesn't prevent the remaining commands from running.
 * @param session The active session to run the commands on.
 * @returns {Promise<void>} A promise that resolves when all commands have been attempted.
 */
async function enableTalkBack(session) {
    try {
        await session.waitUntilReady();

        for (const command of config.talkBackCommands) {
            try {
                console.log(`adb shell ${command}`);
                await session.adbShellCommand(command);
            } catch (error) {
                console.warn(`adb shell command failed: ${command}`, error);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Navigation keys we forward from the page to the device. `session.keypress` maps each of these
 * to the matching device key, so a TalkBack user can move around with the keyboard.
 */
const forwardedKeys = new Set([
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab', 'Backspace'
]);

/**
 * Forwards keyboard navigation to the device. The embed runs in a cross-origin iframe, so key
 * events only reach the device once something inside that iframe has focus. Instead of relying on
 * that, we listen for key presses on this page and relay them to the device via `session.keypress`.
 *
 * Note: `session.keypress` uses the action recorder under the hood, so it requires the session's
 * `record` option to be enabled. It currently works because that defaults to `true`.
 */
function observeKeyboard() {
    window.addEventListener('keydown', async (event) => {
        if (!window.session || !forwardedKeys.has(event.key)) {
            return;
        }
        // Prevent the arrow keys from scrolling the page / Tab from moving page focus.
        event.preventDefault();
        try {
            await window.session.keypress(event.key, { shift: event.shiftKey });
        } catch (error) {
            console.warn(`Failed to forward key "${event.key}" to the device`, error);
        }
    });
}

/**
 * Gives this page keyboard focus so the listener in observeKeyboard fires without the user
 * clicking first. The body isn't focusable by default, so we make it focusable and focus it.
 */
function focusPage() {
    if (!document.body) {
        return;
    }
    document.body.setAttribute('tabindex', '-1');
    document.body.focus({ preventScroll: true });
}

/**
 * Applies the launch config to the embed and starts a session. Audio output and TalkBack are
 * always enabled, and the session auto-starts (see initClient).
 * @returns {Promise<void>} A promise that resolves when the config is applied.
 */
async function updateSession() {
    try {
        const iFrame = document.querySelector(appetizeIframeName);
        iFrame.referrerPolicy = "unsafe-url";

        const sessionConfig = {
            publicKey: selection.publicKey(),
            device: config.app[selection.platform].device,
            osVersion: config.app[selection.platform].osVersion,
            centered: config.centered,
            scale: config.scale,
            toast: config.toast,
            orientation: 'portrait',
            // (Android only) Audio playback is always enabled on the device.
            audio: true,
            // Device volume, a number from 0 to 1.
            volume: config.volume
        };

        // Note: TalkBack is enabled at runtime via session.adbShellCommand once the device is
        // ready (see enableTalkBack), rather than the start-time adbShellCommand config flag.

        console.log(sessionConfig);

        if (!window.client) {
            // Initialise the client and auto-start the session (see initClient).
            await initClient(sessionConfig);
        } else {
            // Update the config for the next session the user starts (ends any active session).
            await window.client.setConfig(sessionConfig);
        }
    } catch (error) {
        console.error(error);
    }
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    observeKeyboard();
    await updateSession();
});
