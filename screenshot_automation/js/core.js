// Description: Core functions for the Screenshot launch template.
// Variables

const appetizeIframeName = 'appetize';
const startSessionButton = document.getElementById('start_session');
const imagesContainer = document.getElementById('images-container');
const imageModalElement = document.getElementById('imageModal');
const appetizeIframe = document.getElementById(appetizeIframeName);

let activeSession = {
    app: null
}

/**
 * All the screenshot data when the process is complete, in format:
 *  [{
 *      name: screenshotName,
 *      data: imageData
 *  }]
 */
let imageData;

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
 * Initializes the client.
 * @param config The initial config to use for the client.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient(config) {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(`#${appetizeIframeName}`, config);
        console.log('client loaded!');
    } catch (error) {
        console.error(error);
    }
}

/**
 * Updates the session with the provided public key, and device.
 * @param publicKey The public key for the app.
 * @param device The device and osVersion to use for the session.
 * @returns {Promise<void>} A promise that resolves when the session is updated.
 */
async function updateSession(publicKey, device) {
    try {
        const sessionConfig = {
            publicKey: publicKey,
            device: device.device,
            osVersion: device.osVersion,
            centered: "both",
            scale: "auto",
        }

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
 * Starts a session for each device in each app in the config.
 * Waits until all session screenshots are complete before returning.
 * NOTE: Any previous session data will be cleared.
 * @returns {Promise<void>} A promise that resolves when all sessions are complete.
 */
async function startSessionForDevices() {
    imageData = [];
    imagesContainer.replaceChildren();
    setStartSessionButtonIsEnabled(false);
    setAppetizerVisibility(true);

    // Loop through each app
    for (const app of config.apps) {
        console.log(`Running playback actions for app: ${app.name}`);
        activeSession.app = app;

        const appHeader = createH2Header(app.name);
        imagesContainer.appendChild(appHeader);

        // Loop through each device
        for (const device of app.devices) {
            await updateSession(app.publicKey, device);
            const title = `${device.displayName} - ${device.osVersion}`
            console.log(title);
            const deviceHeader = createH3Header(title);
            imagesContainer.appendChild(deviceHeader);

            console.log(`Starting screenshot automation for ${app.name}: ${device.device.displayName} - ${device.osVersion}`);
            await startScreenshotAutomation(app, device);
        }
    }

    if (imageData.length > 0) {
        imagesContainer.appendChild(createDownloadAllContent());
    }

    setStartSessionButtonIsEnabled(true);
    setAppetizerVisibility(false);
    clearSession();
}

/**
 * Starts the screenshot automation for the provided session, app, and device.
 * @param app The app to use for the screenshot automation.
 * @param device The device to use for the screenshot automation.
 * @returns {Promise<void>} A promise that resolves when the screenshot automation is complete.
 */
async function startScreenshotAutomation(app, device) {
    try {
        // Loop through each language
        for (const language of app.languages) {
            console.log(`Language: ${language}`);
            await session.setLanguage(language);
            await session.reinstallApp();

            const imageCollectionCard = createImageCollectionCard(language.toUpperCase());
            imagesContainer.appendChild(imageCollectionCard.cardDiv);

            // Loop through each screen
            for (const screen of app.screens) {
                console.log(`Screen: ${screen.displayName}`);
                await screen.playbackActions(client, session, language);

                const screenshotName = `${app.name.toLowerCase()}_${device.device}_${device.osVersion}_${screen.displayName.toLowerCase()}_${language.toLowerCase()}`
                    .replace(/ /g, "_");

                // Take a screenshot
                console.log('Taking screenshot');
                const screenshot = await session.screenshot('base64')
                await appendScreenshot(screenshot, imageCollectionCard.grid, screenshotName);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * Clears the active session.
 */
function clearSession() {
    activeSession.app = null;
}

/**
 * Appends the screenshot to the grid and adds a click event to open the modal.
 * @param screenshot The screenshot to append.
 * @param grid The grid to append the screenshot to.
 * @param screenshotName The name of the screenshot.
 * @returns {Promise<void>} A promise that resolves when the screenshot is appended.
 */
async function appendScreenshot(screenshot, grid, screenshotName) {
    const image = screenshot.data;
    imageData.push({
        name: screenshotName,
        data: image
    });

    const thumbnail = document.createElement('img');
    thumbnail.classList.add('thumbnail', 'img-thumbnail');
    thumbnail.src = image;
    thumbnail.alt = screenshotName;

    thumbnail.addEventListener('click', () => {
        openModal(image);
    });

    grid.appendChild(thumbnail);
}

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
 * Downloads all the images in the imageData array as a zip file.
 */
function downloadAllImages() {
    const zip = new JSZip();

    imageData.forEach((image, index) => {
        const filename = `${image.name}.jpg`;
        const blob = base64ToBlob(image.data);
        zip.file(filename, blob);

        // Check if all images have been processed
        if (index === imageData.length - 1) {
            // Generate the zip file and initiate the download
            zip.generateAsync({type: 'blob'}).then((content) => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = 'images.zip';
                downloadLink.click();
            });
        }
    });
}

/**
 * Opens the image modal with the specified image.
 * @param imageSrc The source of the image to open in the modal.
 */
function openModal(imageSrc) {
    const modalImage = document.querySelector('#imageModal .modal-image');
    modalImage.src = imageSrc;

    const imageModal = new bootstrap.Modal(imageModalElement);
    imageModal.show();
}

/**
 * Creates a h2 header element.
 * @param title The title of the header.
 * @returns {HTMLHeadingElement} The h2 header element.
 */
function createH2Header(title) {
    const header = document.createElement('h2');
    header.classList.add('mb-6', 'display-5', 'ps-8', 'mt-8');
    header.innerText = title;
    return header;
}

/**
 * Creates a h3 header element.
 * @param title The title of the header.
 * @returns {HTMLHeadingElement} The h3 header element.
 */
function createH3Header(title) {
    const header = document.createElement('h3');
    header.innerText = title;
    return header;
}

/**
 * Creates a grid element.
 * @returns {HTMLDivElement} The grid element.
 */
function createGrid() {
    const imageGrid = document.createElement('div');
    imageGrid.classList.add('row');
    return imageGrid;
}

/**
 * Creates a card element with a header and image grid.
 * @param title The title of the card.
 * @returns {{cardDiv: HTMLDivElement, grid: HTMLDivElement}} The card element and the grid element.
 */
function createImageCollectionCard(title) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'mb-3');

    const cardHeaderDiv = document.createElement('h5');
    cardHeaderDiv.classList.add('card-header');
    cardHeaderDiv.textContent = title;

    // Create the inner div element with class "card-body"
    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    const grid = createGrid();
    cardBodyDiv.appendChild(grid);

    cardDiv.appendChild(cardHeaderDiv);
    cardDiv.appendChild(cardBodyDiv);

    return {cardDiv, grid};
}

/**
 * Creates a styled download all images button
 * @returns {HTMLDivElement} A div element with the download all button.
 */
function createDownloadAllContent() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-grid', 'gap-2', 'col-6', 'mx-auto', 'mb-3');

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('btn', 'btn-primary');
    downloadButton.innerText = 'Download All';
    downloadButton.addEventListener('click', downloadAllImages);
    buttonContainer.appendChild(downloadButton);
    return buttonContainer;
}

/**
 * Sets the state of the start session button
 * @param enabled {boolean} - Whether the button should be enabled or disabled
 */
function setStartSessionButtonIsEnabled(enabled) {
    if (enabled) {
        startSessionButton.classList.remove('disabled');
        startSessionButton.innerHTML = 'Start Screenshot Automation';
    } else {
        startSessionButton.classList.add('disabled');
        startSessionButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Taking screenshots...';

    }
}

/**
 * Sets the visibility of the Appetize iframe.
 * @param visible {boolean} - Whether the iframe should be visible or not.
 */
function setAppetizerVisibility(visible) {
    if (visible) {
        appetizeIframe.classList.remove('d-none');
    } else {
        appetizeIframe.classList.add('d-none');
    }
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
});

// Event Listeners

startSessionButton.addEventListener('click', async function (event) {
    try {
        if (activeSession.app == null) {
            await startSessionForDevices();
        }
    } catch (error) {
        console.error(error);
    }
});
