// Description: Core functions for the launch template.
// Variables

const appetizeIframeName = '#appetize';

let selection = {
    platform: null,
    device: null,
    os: null,
    isPortrait: true,
    publicKey: () => {
        return config.app[selection.platform].publicKey
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
                setOrientationControlsEnabled(true);

                session.on("end", () => {
                    console.log('session ended!');
                    window.session = null;
                    setOrientationControlsEnabled(false);
                });
            } catch (error) {
                console.error(error);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fetches the device and OS data from the API.
 * @returns {Promise<any>} A promise that resolves with the device and OS data.
 */
async function fetchDeviceAndOSData() {
    try {
        const response = await fetch('https://api.appetize.io/v2/service/devices');
        const devices = await response.json();

        return devices
            // We want to only get devices that support the minimum OS version for the app.
            .filter(device => {
                const platform = device.platform;
                const osVersionsSupportedInDevice = device.osVersions;
                const minOsVersion = Number(config.app[platform].osVersion);
                return osVersionsSupportedInDevice.some(osVersion => Number(osVersion) >= minOsVersion);
            })
            // We want to only get OS versions that support the minimum OS version for the app.
            .map(device => {
                return {
                    ...device,
                    osVersions: device.osVersions.filter(osVersion => Number(osVersion) >= Number(config.app[device.platform].osVersion))
                }
            });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Populates the device and OS dropdowns with the data from the API.
 * @returns {Promise<void>} A promise that resolves when the dropdowns are populated.
 */
async function populateDropdowns() {
    try {
        const data = await fetchDeviceAndOSData();
        window.data = data;
        populateDeviceDropdownForPlatform(config.defaultPlatform);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Populates the device dropdown with devices for the given platform.
 * @param {string} platform The platform to filter devices by ('ios' or 'android').
 */
function populateDeviceDropdownForPlatform(platform) {
    const devices = window.data.filter(device => device.platform === platform);
    const deviceDropdown = document.getElementById('device-dropdown-content');
    deviceDropdown.innerHTML = '';

    devices.forEach(device => {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.text = device.name;
        option.value = device.id;
        deviceDropdown.appendChild(option);
    });
}

/**
 * Observes the platform toggle and updates devices accordingly.
 */
function observePlatformToggle() {
    const iosBtn = document.getElementById('ios-btn');
    const androidBtn = document.getElementById('android-btn');

    iosBtn.addEventListener('click', async () => {
        if (selection.platform !== 'ios') {
            iosBtn.classList.add('active');
            androidBtn.classList.remove('active');
            populateDeviceDropdownForPlatform('ios');
            await selectDevice(config.app.ios.defaultDevice);
        }
    });

    androidBtn.addEventListener('click', async () => {
        if (selection.platform !== 'android') {
            androidBtn.classList.add('active');
            iosBtn.classList.remove('active');
            populateDeviceDropdownForPlatform('android');
            await selectDevice(config.app.android.defaultDevice);
        }
    });
}

/**
 * Observes changes to the device dropdown and updates the session when a new device is selected.
 */
function observeDeviceChanges() {
    try {
        const deviceDropDown = document.getElementById('device-dropdown')
        deviceDropDown.addEventListener('hide.bs.dropdown', async event => {

            if (event && event.clickEvent && event.clickEvent.target) {
                let target = findDropdownItem(event.clickEvent.target);
                if (!target) {
                    return;
                }

                if (target && target.classList.contains("inactive")) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                const selectedDevice = target.value;
                await selectDevice(selectedDevice);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

/**
 * Selects a device and populates the OS dropdown with the available OSes for that device.
 * @param device The device to select.
 * @param shouldUpdateSession Whether or not to update the session.
 * @returns {Promise<void>} A promise that resolves when the device is selected.
 */
async function selectDevice(device, shouldUpdateSession = true) {
    try {
        if (!window.data) {
            return;
        }
        const data = window.data;

        const selectedDevice = data.find(deviceData => deviceData.id === device);
        let operatingSystems;
        if (selectedDevice) {
            operatingSystems = selectedDevice.osVersions;
            selection.platform = selectedDevice.platform;

            // Update the device dropdown button text
            const deviceButton = document.getElementById('device-dropdown');
            deviceButton.textContent = selectedDevice.name;
        }

        if (operatingSystems) {
            const osDropdown = document.getElementById('os-dropdown-content');
            osDropdown.innerHTML = '';

            operatingSystems.forEach(os => {
                const option = document.createElement('a');
                option.classList.add('dropdown-item');
                option.text = os;
                option.value = os;
                osDropdown.appendChild(option);
            });

            selection.device = device;
            selection.os = operatingSystems[operatingSystems.length - 1];

            // Update the OS dropdown button text
            const osButton = document.getElementById('os-dropdown');
            osButton.textContent = selection.os;

            if (shouldUpdateSession) {
                await updateSession(selection);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Selects an OS and updates the session.
 * @param os The OS to select.
 * @param shouldUpdateSession Whether or not to update the session.
 * @returns {Promise<void>} A promise that resolves when the OS is selected.
 */
async function selectOS(os, shouldUpdateSession = true) {
    try {
        selection.os = os;

        // Update the OS dropdown button text
        const osButton = document.getElementById('os-dropdown');
        osButton.textContent = os;

        if (shouldUpdateSession) {
            await updateSession(selection);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Observes changes to the OS dropdown and updates the session when the OS is changed.
 */
function observeOSChanges() {
    try {
        const osDropDown = document.getElementById('os-dropdown')
        osDropDown.addEventListener('hide.bs.dropdown', async event => {

            if (event && event.clickEvent && event.clickEvent.target) {
                let target = findDropdownItem(event.clickEvent.target);
                if (target == null || target.value === undefined) {
                    return;
                }

                if (target.classList.contains("inactive")) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                await selectOS(target.value);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

/**
 * Enables or disables the orientation toggle buttons.
 * @param {boolean} enabled Whether the buttons should be enabled.
 */
function setOrientationControlsEnabled(enabled) {
    const portraitBtn = document.getElementById('portrait-btn');
    const landscapeBtn = document.getElementById('landscape-btn');
    portraitBtn.disabled = !enabled;
    landscapeBtn.disabled = !enabled;
}

/**
 * Observes the orientation toggle and rotates the device accordingly.
 */
function observeOrientationToggle() {
    try {
        const portraitBtn = document.getElementById('portrait-btn');
        const landscapeBtn = document.getElementById('landscape-btn');

        portraitBtn.addEventListener('click', async () => {
            if (!selection.isPortrait) {
                selection.isPortrait = true;
                portraitBtn.classList.add('active');
                landscapeBtn.classList.remove('active');
                if (window.session) {
                    await session.rotate('left');
                }
            }
        });

        landscapeBtn.addEventListener('click', async () => {
            if (selection.isPortrait) {
                selection.isPortrait = false;
                landscapeBtn.classList.add('active');
                portraitBtn.classList.remove('active');
                if (window.session) {
                    await session.rotate('right');
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Resets the orientation toggle back to portrait.
 */
function resetOrientationToPortrait() {
    selection.isPortrait = true;
    document.getElementById('portrait-btn').classList.add('active');
    document.getElementById('landscape-btn').classList.remove('active');
}

/**
 * Updates the session with the current selection and configurations.
 * @param selection The current selection to start the session with.
 * @returns {Promise<void>} A promise that resolves when the session is updated.
 */
async function updateSession(selection) {
    try {
        resetOrientationToPortrait();

        const iFrame = document.querySelector(appetizeIframeName);
        iFrame.referrerPolicy = "unsafe-url";

        const sessionConfig = {
            publicKey: selection.publicKey(),
            device: selection.device,
            osVersion: selection.os,
            centered: config.centered,
            scale: config.scale,
            toast: config.toast,
            orientation: selection.isPortrait ? 'portrait' : 'landscape',
            record: false
        }

        if (!window.client) {
            await initClient(sessionConfig);
        }

        console.log(selection);
        const session = await window.client.startSession(sessionConfig);
        console.log(session);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Starts a session with the device specified on the default platform.
 * @returns {Promise<void>} A promise that resolves when the session is started.
 */
async function startDefaultSession() {
    // Sync the platform toggle with the configured default
    if (config.defaultPlatform === 'android') {
        document.getElementById('android-btn').classList.add('active');
        document.getElementById('ios-btn').classList.remove('active');
    }
    await selectDevice(config.app[config.defaultPlatform].defaultDevice);
}

/**
 * Creates a dropdown header.
 * @param title The title of the header.
 * @returns {HTMLHeadingElement} The dropdown header.
 */
function createDropdownHeader(title) {
    const header = document.createElement('h6');
    header.classList.add('dropdown-header');
    header.innerText = title;
    return header;
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

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    await populateDropdowns();
    observePlatformToggle();
    observeDeviceChanges();
    observeOSChanges();
    observeOrientationToggle();
    await startDefaultSession();
});
