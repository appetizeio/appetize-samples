// Description: Core functions for the save video template.
// Variables
let h264Frames = []
let videoBuffer = []
const appetizeIframeName = '#appetize';
const toggleRecording = document.getElementById('toggle_recording');
const showRecordingButton = document.getElementById('show_recording');
const saveRecordingButton = document.getElementById('save_recording');
const recordingModalElement = document.getElementById('recordingModal');
const iosButton = document.getElementById('ios_button')
const androidButton = document.getElementById('android_button')
let jmuxer;
let jmuxerReady = false
let recording = false

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

/**
 * Waits for JMuxer to be ready
 * @returns {Promise<void>} A promise that resolves once jmuxer on ready has been called
 */
function waitForJMuxer() {
    // Check that the client has loaded
    return new Promise(res => {
        let i = setInterval(() => {
            if (jmuxerReady) {
                clearInterval(i)
                res()
            }
        }, 200)
    })
}


// Event listeners

function setupPlatformSelection() {
    const eventButtonHandler = async (button, platform) => {
        // If it's the current active don't do anything
        if (button.classList.contains('active')) return
        await window.client.endSession()
        await window.client.setConfig({
            publicKey: config.products[platform]
        })
        // Remove the current active element
        document.querySelector('.active').classList.remove('active')
        button.classList.add('active')
    }

    // Enable buttons
    setDisabled(iosButton, false)
    setDisabled(androidButton, false)

    // Setup handlers
    iosButton.addEventListener('click', () => eventButtonHandler(iosButton, 'ios'))
    androidButton.addEventListener('click', () => eventButtonHandler(androidButton, 'android'))
}

/**
 * Stops the recording and feed JMuxer with the frames
 */
function setupToggleVideoRecordingButton() {
    toggleRecording.onclick = async () => {
        // Disable until the next action can be performed
        setDisabled(toggleRecording, true)

        if (recording) {
            // Clear the frames and disable the button
            await window.session.end()
        } else {
            await window.client.startSession();
        }
    }
}

/**
 * Shows the recording modal after the button click
 */
function setUpShowVideoRecordingButton() {
    showRecordingButton.onclick = async () => {
        const recordingModal = new bootstrap.Modal(recordingModalElement);
        recordingModal.show();
    }
}

function toggleRecordingState() {
    recording = !recording
    if (!recording) {
        toggleRecording.classList.remove('btn-outline-primary')
        toggleRecording.classList.add('btn-primary')
        toggleRecording.innerText = 'Start recording'
    } else {
        toggleRecording.classList.remove('btn-primary')
        toggleRecording.classList.add('btn-outline-primary')
        toggleRecording.innerText = 'Stop recording'
    }
}

/**
 * Downloads the data processed by JMuxer as a mp4 file
 */
function setUpSaveVideoRecordingButton() {
    saveRecordingButton.onclick = async () => {
        const blob = new Blob(videoBuffer, {type: 'video/mp4'});
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'recording.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the Blob URL
        URL.revokeObjectURL(downloadUrl);
    }
}

/**
 * Susbscribes the Appetize session to record all the frames and clean the state once the session
 * has finished
 * @param {Session} session
 */
function subscribeSessionEvents(session) {
    session.on('video', data => {
        h264Frames.push(data.buffer)
    })

    session.on('end', async () => {
        toggleRecordingState()
        setDisabled(showRecordingButton, false)
        setDisabled(saveRecordingButton, false)
        setDisabled(toggleRecording, false)
        jmuxer.reset()
        await waitForJMuxer()
        h264Frames.forEach((frame) => {
            jmuxer.feed({
                video: frame
            });
        })
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

function initJMuxer() {
    jmuxer = new JMuxer({
        node: 'recording',
        mode: 'video',
        clearBuffer: false,
        debug: false, // set to true to enable debug logs
        onReady: () => {
            jmuxerReady = true
        },
        onError: (error) => {
            console.error(error)
        },
        onData: (data) => {
            videoBuffer.push(data)
        }
    });
}


/**
 * Initializes the client and adds the session event listener.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient() {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName, {
            publicKey: config.products.ios,
            scale: 'auto',
            centered: 'both'
        });
        console.log('client loaded!');
        window.client.on("session", async session => {
            try {
                toggleRecordingState()
                window.session = session
                console.log('session started!')
                h264Frames = []
                videoBuffer = []
                // Enable the recording once the session has started
                setDisabled(toggleRecording, false)
                setDisabled(saveRecordingButton, true)
                setDisabled(showRecordingButton, true)
                subscribeSessionEvents(session)
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
    initAnimations()
    await initClient()
    setupToggleVideoRecordingButton()
    setUpShowVideoRecordingButton()
    setUpSaveVideoRecordingButton()
    setupPlatformSelection()
    initJMuxer()
})