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

            // Focus the embed iframe so keyboard input (e.g. the arrow keys) is routed to the
            // device out of the box, without the user having to click the device first.
            focusDevice();

            // TalkBack is always enabled at runtime, once the device is ready.
            await enableTalkBack(session);
        });
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
 * Focuses the embed iframe so the browser routes keyboard events to the device. With the iframe
 * focused the device's arrow keys, Enter, etc. work immediately &mdash; handy for navigating with
 * TalkBack without first clicking on the device.
 */
function focusDevice() {
    const iFrame = document.querySelector(appetizeIframeName);
    if (iFrame) {
        iFrame.focus();
    }
}

/**
 * Applies the launch config to the embed. Audio output and TalkBack are always enabled.
 * The session is NOT auto-started — the user starts it by clicking "Tap to Play".
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
            record: false,
            // (Android only) Audio playback is always enabled on the device.
            audio: true,
            // Device volume, a number from 0 to 1.
            volume: config.volume
        };

        // Note: TalkBack is enabled at runtime via session.adbShellCommand once the device is
        // ready (see enableTalkBack), rather than the start-time adbShellCommand config flag.

        console.log(sessionConfig);

        if (!window.client) {
            // Initialise the client with the config but don't start a session — the embed
            // shows "Tap to Play" and the user starts the session when they're ready.
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
    await updateSession();
});
