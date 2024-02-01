// Description: Core functions for the launch template.
// Variables

const appetizeIframeName = '#appetize';

let selection = {
    platform: null,
    device: null,
    os: null,
    isPortrait: true,
    publicKey: () => { return config.app[selection.platform].publicKey }
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
        const response = await fetch('https://appetize.io/available-devices');
        return await response.json();
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
        const iOSDevices = Object.keys(data.ios);
        const androidDevices = Object.keys(data.android);

        const deviceDropdown = document.getElementById('device-dropdown-content');
        deviceDropdown.appendChild(createDropdownHeader('iOS'));
        iOSDevices.forEach(device => {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.text = getDisplayName(device);
            option.value = device;
            deviceDropdown.appendChild(option);
        });
        deviceDropdown.appendChild(createDropdownHeader('Android'));
        androidDevices.forEach(device => {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.text = getDisplayName(device);
            option.value = device;
            deviceDropdown.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
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

        let operatingSystems;
        if (device in data.ios) {
            operatingSystems = data.ios[device];
            selection.platform = 'ios';
        } else if (device in data.android) {
            operatingSystems = data.android[device];
            selection.platform = 'android';
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
            if(shouldUpdateSession) {
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
 * Rotates the device in the given direction.
 * @param direction The direction to rotate the device, either 'left' or 'right'.
 * @returns {Promise<void>} A promise that resolves when the device is rotated.
 */
async function rotateDevice(direction) {
    try {
        if(window.session) {
            selection.isPortrait = !selection.isPortrait;
            updateAppetizeClassList();
            await session.rotate(direction);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Updates the Appetize iFrame with the appropriate orientation class to get the preferred sizing.
 */
function updateAppetizeClassList() {
    const iFrame = document.getElementById("appetize");
    if(selection.isPortrait) {
        iFrame.classList.remove('landscape');
        iFrame.classList.add('portrait');
    } else {
        iFrame.classList.remove('portrait');
        iFrame.classList.add('landscape');
    }
}

/**
 * Observes the rotation buttons and rotates the device accordingly.
 */
function observeRotationChanges() {
    try {
        const rotateLeftButton = document.getElementById('rotate-left');
        rotateLeftButton.addEventListener('click', async event => {
            await rotateDevice('left');
        });

        const rotateRightButton = document.getElementById('rotate-right');
        rotateRightButton.addEventListener('click', async event => {
            await rotateDevice('right');
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Updates the session with the current selection and configurations.
 * @param selection The current selection to start the session with.
 * @returns {Promise<void>} A promise that resolves when the session is updated.
 */
async function updateSession(selection) {
    try {
        const sessionConfig = {
            publicKey: selection.publicKey(),
            device: selection.device,
            osVersion: selection.os,
            centered: config.centered,
            scale: config.scale,
            toast: config.toast
        }

        if(!window.client) {
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
 * Starts a session with the default device specified on the iOS platform.
 * @returns {Promise<void>} A promise that resolves when the session is started.
 */
async function startDefaultSession() {
    await selectDevice(config.app.ios.defaultDevice);
}

/**
 * Gets a pretty display name for the device.
 * @param deviceName The unformatted device name.
 * @returns {string} The pretty display name for the device.
 */
function getDisplayName(deviceName) {
    const deviceMapping = {
        "iphone8": "iPhone 8",
        "iphone8plus": "iPhone 8 Plus",
        "iphone11pro": "iPhone 11 Pro",
        "iphone12": "iPhone 12",
        "iphone13pro": "iPhone 13 Pro",
        "iphone13promax": "iPhone 13 Pro Max",
        "iphone14pro": "iPhone 14 Pro",
        "iphone14promax": "iPhone 14 Pro Max",
        "iphone15pro": "iPhone 15 Pro",
        "iphone15promax": "iPhone 15 Pro Max",
        "ipadair4thgeneration": "iPad Air (4th Generation)",
        "ipadpro129inch5thgeneration": "iPad Pro 12.9-inch (5th Generation)",
        "ipad9thgeneration": "iPad (9th Generation)",
        "nexus5": "Nexus 5",
        "pixel4": "Pixel 4",
        "pixel4xl": "Pixel 4 XL",
        "pixel6": "Pixel 6",
        "pixel6pro": "Pixel 6 Pro",
        "pixel7": "Pixel 7",
        "pixel7pro": "Pixel 7 Pro",
        "galaxytabs7": "Galaxy Tab S7"
    };

    return deviceMapping[deviceName] || deviceName;
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
    await new Promise(res => {
        let i = setInterval(() => {
            if (window.appetize.getClient) {
                clearInterval(i)
                res()
            }
        }, 100)
    })
    await populateDropdowns();
    observeDeviceChanges();
    observeOSChanges();
    observeRotationChanges();
    await startDefaultSession();
});
