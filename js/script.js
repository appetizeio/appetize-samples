// Description: Core functions for Sample Page.

// Global Variables

const sampleLinks = document.querySelectorAll(`.sampleLink`);
const logoInput = document.getElementById("logoUpload");
const primaryColorInput = document.getElementById("primaryColor");
const primaryColorDarkInput = document.getElementById("primaryColorDark");
const primaryForegroundColorInput = document.getElementById("primaryForegroundColor");

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
 * Updates the primary color in the sample links.
 */
function updatePrimaryColor() {
    const primaryColorValue = primaryColorInput.value;
    updateSampleLinksQueryStrings((url) => {
        updateQueryStringParameter(url, "primaryColor", primaryColorValue);
    });
}

/**
 * Updates the primary color dark in the sample links.
 */
function updatePrimaryColorDark() {
    const primaryColorDarkValue = primaryColorDarkInput.value;
    updateSampleLinksQueryStrings((url) => {
        updateQueryStringParameter(url, "primaryColorDark", primaryColorDarkValue);
    });
}

/**
 * Updates the primary foreground color in the sample links.
 */
function updatePrimaryForegroundColor() {
    const primaryForegroundColor = primaryForegroundColorInput.value;
    updateSampleLinksQueryStrings((url) => {
        updateQueryStringParameter(url, "primaryForegroundColor", primaryForegroundColor);
    });
}

/**
 * Updates the logo in the sample links.
 */
function updateLogo() {
    console.log("Updating logo")
    const logoValue = logoInput.value;
    if(!isValidURL(logoValue)) {
        console.log("Invalid URL");
        return;
    }
    updateSampleLinksQueryStrings((url) => {
        updateQueryStringParameter(url, "logo", logoValue);
    });
}

/**
 * Checks if a URL is valid.
 * @param url
 * @returns {boolean}
 */
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Updates the query strings in the sample links.
 * @param callback A callback function that takes a URL object and updates it.
 */
function updateSampleLinksQueryStrings(callback) {
    sampleLinks.forEach((link) => {
        const url = new URL(link.href);
        callback(url);
        link.href = url.toString();
        console.log(`Updated URL: ${link.href}`);
    });
}

/**
 * Updates a query string parameter in a URL.
 * @param url The URL to update.
 * @param key The key of the query string parameter to set or update.
 * @param value The value of the query string parameter to update.
 * @returns {string} The updated URL.
 */
function updateQueryStringParameter(url, key, value) {
    console.log(`Updating ${key} to ${value}`);
    const searchParams = new URLSearchParams(url.search);

    if (searchParams.has(key)) {
        searchParams.set(key, value);
    } else {
        searchParams.append(key, value);
    }

    url.search = searchParams.toString();
    return url.toString();
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
});

logoInput.addEventListener("change", updateLogo);
primaryColorInput.addEventListener("change", updatePrimaryColor);
primaryColorDarkInput.addEventListener("change", updatePrimaryColorDark);
primaryForegroundColorInput.addEventListener("change", updatePrimaryForegroundColor);

