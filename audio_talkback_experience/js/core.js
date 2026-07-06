// Description: Core functions for the TalkBack experience.
// Variables

const appetizeIframeName = '#appetize';

let selection = {
    platform: config.defaultPlatform,
    audio: true,       // Whether audio output is enabled on the device. On by default.
    talkBack: true,    // Whether the TalkBack screen reader is enabled on the device. On by default.
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

            // Enable TalkBack at runtime, once the device is ready.
            if (selection.talkBack) {
                await enableTalkBack(session);
            }
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
 * Applies the current audio & TalkBack selection to the embed's launch config.
 * The session is NOT auto-started — the user starts it by clicking "Tap to Play". Changing a
 * toggle updates the config via setConfig (which ends any active session), so the next session
 * the user starts picks up the new configuration.
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
            // (Android only) Enables audio playback on the device.
            audio: selection.audio,
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

/**
 * Observes the audio & TalkBack toggles and restarts the session when they change.
 */
function observeToggles() {
    const audioToggle = document.getElementById('audio-toggle');
    const talkBackToggle = document.getElementById('talkback-toggle');

    audioToggle.addEventListener('change', async () => {
        selection.audio = audioToggle.checked;
        await updateSession();
    });

    talkBackToggle.addEventListener('change', async () => {
        selection.talkBack = talkBackToggle.checked;

        // TalkBack speaks aloud, so it's only useful with audio enabled.
        // Turn audio on automatically (and reflect it in the UI) when TalkBack is enabled.
        if (selection.talkBack && !selection.audio) {
            selection.audio = true;
            audioToggle.checked = true;
        }

        await updateSession();
    });
}

/**
 * Wires up the "Open Sample Video" button, opening a sample video on the running session
 * (via session.openUrl) so there's something audible to play. The click doubles as the user
 * gesture browsers require before audio can play.
 */
function observeSampleVideo() {
    const openVideoButton = document.getElementById('open-video-btn');

    openVideoButton.addEventListener('click', async () => {
        if (!window.session) {
            console.log('No active session to open the sample video on.');
            return;
        }
        await window.session.openUrl(config.sampleVideoUrl);
    });
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    observeToggles();
    observeSampleVideo();
    await updateSession();
});
