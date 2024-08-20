// Description: Core functions for the save video template.
// Variables
let playback = false
let selected = config.products[0]
let actions = []
const appetizeIframeName = '#appetize';
const saveActions = document.getElementById("save_actions")
const replayActions = document.getElementById("replay_actions")
const showActions = document.getElementById("show_actions")
const actionsModal = document.getElementById('actions_modal')
const copyActions = document.getElementById('copy_actions')
const iosButton = document.getElementById('ios_button')
const androidButton = document.getElementById('android_button')

// Util functions
/**
 * Update the button element with the new disabled state
 * @param {HTMLButtonElement} button 
 * @param {boolean} disabled 
 */
function setDisabled(button, disabled) {
    button.disabled = disabled
    if (!disabled) button.classList.remove('disabled')
    else button.classList.add('disabled')
}

function getConfiguration() {
    return { publicKey: selected.buildId }
}



// Event listeners

function showActionsListener() {
    copyActions.addEventListener('click', async () => {
        const orignalHtml = copyActions.innerHTML
        try {
            setDisabled(copyActions, true)
            navigator.clipboard.writeText(JSON.stringify(actions, null, 2))
            copyActions.innerHTML = 'Copied!'
        } catch (error) {
            console.error('Error copying to clipboard', error)
        }
        setTimeout(() => {
            setDisabled(copyActions, false)
            copyActions.innerHTML = orignalHtml
        }, 1000)
    })
    showActions.addEventListener('click', () => {
        const code = document.getElementById('actions')
        code.innerHTML = JSON.stringify(actions, null, 2)
        code.removeAttribute('data-highlighted')
        const modal = new bootstrap.Modal(actionsModal);
        modal.show();
        hljs.highlightAll();
    })
}

/**
 * Binds the listener to download the actions as a json file.
 */
function downloadActionsListener() {
    saveActions.addEventListener('click', () => {
        // Create a blob of the data
        const blob = new Blob([JSON.stringify(actions)], {
            type: 'application/json'
        });
        const a = document.createElement("a");
        a.download = `actions-${selected.platform}.json`;
        const downloadUrl = URL.createObjectURL(blob);
        a.href = downloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the Blob URL
        URL.revokeObjectURL(downloadUrl);
    })
}

/**
 * Binds the restart and playback actions callback to the button
 */
function restartAndReplayActionsListener() {
    replayActions.addEventListener('click', async () => {
        if (!window.session) return
        const session = window.session
        playback = true
        const text = replayActions.innerText
        setDisabled(replayActions, true)
        setDisabled(androidButton, true)
        setDisabled(iosButton, true)
        try {
            replayActions.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Replaying actions...';
            // reinstall app to reset the state. Not required, but for purposes
            // of this example we want to start fresh each time.
            await session.reinstallApp()

            console.log('Playing back actions: ', actions)
            await session.playActions(actions)
            console.log('Playback complete')
            window.confetti.addConfetti();
        } catch (error) {
            console.error('An error ocurred with the playback', error)
        }
        replayActions.innerText = text
        setDisabled(replayActions, false)
        setDisabled(androidButton, false)
        setDisabled(iosButton, false)

        playback = false
    })
}

/**
 * Binds the platform buttons and triggers a session with the new selection
 */
function subscribePlatformButtonListeners() {
    ['ios', 'android'].forEach((platform, index) => {
        const button = document.getElementById(`${platform}_button`)
        // Enable the button default is disabled
        button.classList.remove('disabled')
        button.disabled = false
        button.addEventListener('click', () => {
            // If it's the current active don't do anything
            if (button.classList.contains('active')) return
            updateSession(config.products[index])
            // Remove the current active element
            document.querySelector('.active').classList.remove('active')
            button.classList.add('active')
        })
    })
}

/**
 * Subscribes the session to listen all the actions and store all of them
 * @param {Session} session
 */
function subscribeSessionForActions(session) {
    session.on('action', action => {
        // Only record if it the playback is finished
        if (!playback) {
            actions.push(action)
            setDisabled(saveActions, false)
            setDisabled(replayActions, false)
            setDisabled(showActions, false)
        }
    })

    session.on('end', () => {
        // Clear all the actions
        actions = []
        setDisabled(saveActions, true)
        setDisabled(replayActions, true)
        setDisabled(showActions, true)
    })
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
 * Updates the session with the selected product
 * @param selection The selected product
 * @returns {Promise<void>} A promise that resolves when the session is updated.
 */
async function updateSession(selection) {
    try {
        selected = selection
        const sessionConfig = getConfiguration()
        console.log(`Starting session with config: ${JSON.stringify(sessionConfig)}`);

        if (!window.client) {
            await initClient(sessionConfig);
        }

        window.session = await window.client.startSession(sessionConfig);
        console.log('session started!')
        return window.session;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Initializes the client and adds the session event listener.
 * @param sessionConfig The configuration to use for the client
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient(sessionConfig) {
    try {
        // Check that the client has loaded
        await new Promise(res => {
            let i = setInterval(() => {
                if (window.appetize.getClient) {
                    clearInterval(i)
                    res()
                }
            }, 100)
        })
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName, sessionConfig);
        console.log('client loaded!');
        window.client.on("session", async session => {
            try {
                window.session = session
                console.log('session started!')
                subscribeSessionForActions(session)
            } catch (error) {
                console.error(error);
                window.session = null;
            }
        })
    } catch (error) {
        window.client = null;
        console.error(error);
    }
}


// DOM Loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.confetti = new JSConfetti();
    initAnimations()
    await initClient(getConfiguration())
    subscribePlatformButtonListeners()
    restartAndReplayActionsListener()
    downloadActionsListener()
    showActionsListener()
})