// Description: Core functions for the CMS preview experience template.

// Elements
const appetizeIframeName = '#appetize';
const platformPicker = document.getElementById('platformPicker');
const blocksContainer = document.getElementById('blocksContainer');
const addBlockButton = document.getElementById('addBlock');
const launchPreviewButton = document.getElementById('launchPreview');
const deepLinkPreview = document.getElementById('deepLinkPreview');
const jsonPreview = document.getElementById('jsonPreview');
const lengthStatus = document.getElementById('lengthStatus');
const viewPayloadButton = document.getElementById('viewPayload');
const payloadModal = document.getElementById('payloadModal');
const payloadCloseButton = document.getElementById('payloadClose');

const FIELD_IDS = ['title', 'subtitle', 'badge', 'ctaText', 'imageUrl', 'backgroundColor', 'textColor', 'accentColor'];

// iOS silently truncates deep links at 2048 characters (the limit lives in the
// URL delivery path, e.g. `simctl openurl`). Android has no comparable cap.
const IOS_DEEP_LINK_MAX = 2048;

let selectedPlatform = config.defaultPlatform;
let sessionReady = false;
let withinLimit = true;

// Init Functions

/**
 * Renders a platform selection button per configured app.
 */
function initPlatformPicker() {
    const buttons = Object.entries(config.apps).map(([key, app]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = app.name || key;
        button.className = key === selectedPlatform ? 'is-active' : '';
        button.dataset.platform = key;
        button.onclick = () => selectPlatform(key);
        return button;
    });
    platformPicker.replaceChildren(...buttons);
}

/**
 * Populates the form fields and content blocks from config.defaultContent.
 */
function initForm() {
    const content = config.defaultContent || {};
    FIELD_IDS.forEach((id) => {
        if (content[id] !== undefined) document.getElementById(id).value = content[id];
    });

    (content.blocks || []).forEach((block) => addBlock(block));
    if (!blocksContainer.children.length) addBlock();

    // Live-update the payload preview as the user edits any field.
    FIELD_IDS.forEach((id) => document.getElementById(id).addEventListener('input', updatePreviews));
    addBlockButton.addEventListener('click', () => { addBlock(); updatePreviews(); });
    launchPreviewButton.addEventListener('click', launchPreview);

    updatePreviews();
}

/**
 * Initializes the client and adds the session event listener.
 * @param sessionConfig The session configuration to use.
 */
async function initClient(sessionConfig) {
    try {
        window.client = await window.appetize.getClient(appetizeIframeName, sessionConfig);
        window.client.on('session', async (session) => {
            window.session = session;
            setControlsEnabled(true);
            session.on('end', () => {
                window.session = null;
                setControlsEnabled(false);
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// Event Handlers

/**
 * Selects a platform, updates the picker styling and reloads the session with that app.
 * @param platform The platform key (e.g. "ios" or "android").
 */
async function selectPlatform(platform) {
    if (platform === selectedPlatform && window.session) return;
    selectedPlatform = platform;
    Array.from(platformPicker.children).forEach((button) => {
        button.classList.toggle('is-active', button.dataset.platform === platform);
    });
    setControlsEnabled(false);
    updatePreviews(); // the length limit only applies to iOS, so re-evaluate on switch
    await updateSession();
}

/**
 * Adds a content block row to the form.
 * @param block Optional { heading, body } to prefill the row.
 */
function addBlock(block = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cms-block';

    const heading = document.createElement('input');
    heading.type = 'text';
    heading.className = 'block-heading';
    heading.placeholder = 'Heading';
    heading.value = block.heading || '';

    const body = document.createElement('textarea');
    body.className = 'block-body';
    body.rows = 2;
    body.placeholder = 'Body';
    body.value = block.body || '';

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn-remove';
    remove.textContent = 'Remove';
    remove.onclick = () => { wrapper.remove(); updatePreviews(); };

    heading.addEventListener('input', updatePreviews);
    body.addEventListener('input', updatePreviews);

    wrapper.append(heading, body, remove);
    blocksContainer.appendChild(wrapper);
}

/**
 * Launches (or updates) the preview by opening the CMS deep link with the encoded payload.
 */
async function launchPreview() {
    if (!window.session) {
        console.log('Session not available yet');
        return;
    }
    const deepLink = buildDeepLink();
    if (selectedPlatform === 'ios' && deepLink.length > IOS_DEEP_LINK_MAX) {
        console.warn(`Deep link is ${deepLink.length} chars; iOS truncates at ${IOS_DEEP_LINK_MAX}. Aborting.`);
        return;
    }
    const originalText = launchPreviewButton.innerHTML;
    launchPreviewButton.innerHTML = '<span class="spinner"></span>Updating…';
    launchPreviewButton.disabled = true;
    try {
        await window.session.openUrl(deepLink);
    } catch (error) {
        console.error('Error opening CMS deep link:', error);
    } finally {
        setTimeout(() => {
            launchPreviewButton.innerHTML = originalText;
            launchPreviewButton.disabled = false;
        }, 800);
    }
}

/**
 * Starts (or restarts) the Appetize session for the selected platform.
 */
async function updateSession() {
    try {
        const app = config.apps[selectedPlatform];
        const iFrame = document.querySelector(appetizeIframeName);
        if (!app) {
            iFrame.src = 'about:blank';
            return;
        }

        const sessionConfig = {
            publicKey: app.publicKey,
            device: app.device,
            osVersion: app.osVersion,
            centered: 'both',
            scale: 'auto',
            toast: config.toast,
            grantPermissions: true,
            record: false,
        };

        iFrame.referrerPolicy = 'unsafe-url';
        if (!window.client) {
            await initClient(sessionConfig);
        }
        await window.client.startSession(sessionConfig);
    } catch (error) {
        console.error(error);
    }
}

// Helpers

/**
 * Reads the form into a CMS content object, omitting empty fields.
 * @returns {object} The CMS content payload.
 */
function buildContent() {
    const content = {};
    FIELD_IDS.forEach((id) => {
        const value = document.getElementById(id).value.trim();
        if (value) content[id] = value;
    });

    const blocks = Array.from(blocksContainer.querySelectorAll('.cms-block'))
        .map((block) => ({
            heading: block.querySelector('.block-heading').value.trim(),
            body: block.querySelector('.block-body').value.trim(),
        }))
        .filter((block) => block.heading || block.body);

    if (blocks.length) content.blocks = blocks;
    return content;
}

/**
 * Builds the full deep link for the current form content.
 * @returns {string} The appetize:// deep link including the encoded payload.
 */
function buildDeepLink() {
    const payload = toBase64Url(JSON.stringify(buildContent()));
    return `${config.deepLinkBase}?payload=${payload}`;
}

/**
 * Encodes a string as URL-safe base64 (base64url) without padding, UTF-8 safe.
 * @param str The string to encode.
 * @returns {string} The base64url-encoded string.
 */
function toBase64Url(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Refreshes the deep link and JSON previews from the current form state.
 */
function updatePreviews() {
    const deepLink = buildDeepLink();
    jsonPreview.textContent = JSON.stringify(buildContent(), null, 2);
    deepLinkPreview.textContent = deepLink;

    const length = deepLink.length;
    const isIOS = selectedPlatform === 'ios';
    const over = isIOS && length > IOS_DEEP_LINK_MAX;
    withinLimit = !over;

    if (isIOS) {
        lengthStatus.textContent = over
            ? `Deep link ${length} / ${IOS_DEEP_LINK_MAX} — too long for iOS, shorten the content`
            : `Deep link ${length} / ${IOS_DEEP_LINK_MAX} chars`;
    } else {
        lengthStatus.textContent = `Deep link ${length} chars (no limit on Android)`;
    }
    lengthStatus.classList.toggle('over', over);

    updateLaunchButton();
}

/**
 * Marks whether the Appetize session is ready and refreshes the launch button state.
 * @param enabled Whether a session is available.
 */
function setControlsEnabled(enabled) {
    sessionReady = enabled;
    updateLaunchButton();
}

/**
 * Enables the launch button only when a session is ready and the deep link fits the platform limit.
 */
function updateLaunchButton() {
    launchPreviewButton.disabled = !(sessionReady && withinLimit);
}

/**
 * Wires up the deep link / JSON payload modal (open, close, backdrop, Esc).
 */
function initModal() {
    const open = () => { payloadModal.hidden = false; };
    const close = () => { payloadModal.hidden = true; };
    viewPayloadButton.addEventListener('click', open);
    payloadCloseButton.addEventListener('click', close);
    payloadModal.addEventListener('click', (e) => { if (e.target === payloadModal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !payloadModal.hidden) close(); });
}

// On Page Load

document.addEventListener('DOMContentLoaded', async function () {
    initPlatformPicker();
    initForm();
    initModal();
    await updateSession();
});
