// Description: Core functions for Sample Page.

// Global Variables

const queryParams = new URLSearchParams(window.location.search);
const sampleLinks = document.querySelectorAll(`.sampleLink`);
const logoInput = document.getElementById("logoUpload");
const primaryColorInput = document.getElementById("primaryColor");
const primaryColorDarkInput = document.getElementById("primaryColorDark");
const primaryForegroundColorInput = document.getElementById("primaryForegroundColor");
const optionalAppNameInput = document.getElementById("optionalAppName");
const optionalAndroidPublicKeyInput = document.getElementById("optionalAndroidPublicKey");
const optionaliOSPublicKeyInput = document.getElementById("optionaliOSPublicKey");
const searchFilterInput = document.getElementById("filter-input");
const cards = Array.from(document.querySelectorAll(".card"));
const useCaseContent = document.getElementById('useCaseContent');
const chevronIcon = useCaseContent.previousElementSibling.querySelector('.bi');
const useCaseCheckboxInputs = document.querySelectorAll('.sideMenu .form-check-input')
// Init Functions

/**
 * Updates the primary color in the sample links.
 */
function updatePrimaryColor() {
    const primaryColorValue = primaryColorInput.value;
    updateAllQueryStrings((url) => {
        updateQueryStringParameter(url, "primaryColor", primaryColorValue);
    });
}

/**
 * Updates the primary color dark in the sample links.
 */
function updatePrimaryColorDark() {
    const primaryColorDarkValue = primaryColorDarkInput.value;
    updateAllQueryStrings((url) => {
        updateQueryStringParameter(url, "primaryColorDark", primaryColorDarkValue);
    });
}

/**
 * Updates the primary foreground color in the sample links.
 */
function updatePrimaryForegroundColor() {
    const primaryForegroundColor = primaryForegroundColorInput.value;
    updateAllQueryStrings((url) => {
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
    updateAllQueryStrings((url) => {
        updateQueryStringParameter(url, "logo", logoValue);
    });
}

function updateOptionalAndroidPublicKey() {
    const optionalAndroidPublicKey = optionalAndroidPublicKeyInput.value;
    updateAllQueryStrings((url) => {
        updateQueryStringParameter(url, "optionalAndroidPublicKey", optionalAndroidPublicKey);
    });
}

function updateOptionaliOSPublicKey() {
    const optionaliOSPublicKey = optionaliOSPublicKeyInput.value;
    updateAllQueryStrings((url) => {
        updateQueryStringParameter(url, "optionaliOSPublicKey", optionaliOSPublicKey);
    });
}

function updateOptionalAppName() {
    const appName = optionalAppNameInput.value;
    updateAllQueryStrings((url) => {
        updateQueryStringParameter(url, "optionalAppName", appName);
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
 * Updates the query strings in the main URL.
 * @param callback A callback function that takes a URL object and updates it.
 */
function updateMainUrlQueryStrings(callback) {
    const mainUrl= new URL(window.location.href);
    callback(mainUrl);
    window.history.replaceState({}, document.title, mainUrl.toString());
}

/**
 * Updates the query strings in both the sample links and the main URL.
 * @param callback A callback function that takes a URL object and updates it.
 */
function updateAllQueryStrings(callback) {
    updateSampleLinksQueryStrings(callback);
    updateMainUrlQueryStrings(callback);
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

/**
 * Updates the inputs from the query parameters.
 */
const updateInputsFromQueryParameters = () => {
    updateValueIfQueryParameterExists(logoInput, 'logo', updateLogo);
    updateValueIfQueryParameterExists(primaryColorInput, 'primaryColor', updatePrimaryColor);
    updateValueIfQueryParameterExists(primaryColorDarkInput, 'primaryColorDark', updatePrimaryColorDark);
    updateValueIfQueryParameterExists(primaryForegroundColorInput, 'primaryForegroundColor', updatePrimaryForegroundColor);
    updateValueIfQueryParameterExists(optionalAppNameInput, 'optionalAppName', updateOptionalAppName);
    updateValueIfQueryParameterExists(optionalAndroidPublicKeyInput, 'optionalAndroidPublicKey', updateOptionalAndroidPublicKey);
    updateValueIfQueryParameterExists(optionaliOSPublicKeyInput, 'optionaliOSPublicKey', updateOptionaliOSPublicKey);
    updateValueIfQueryParameterExists(searchFilterInput, 'search', performFilter);
    useCaseCheckboxInputs.forEach(input => {
        updateValueIfQueryParameterExists(input, 'usecase', performFilter);
    });
};

/**
 * Updates the value of an input if the query parameter exists.
 * @param input The input to update.
 * @param queryParameter The query parameter to check for.
 * @param action The action to perform if the query parameter exists.
 */
const updateValueIfQueryParameterExists = (input, queryParameter, action) => {
    if(queryParams.has(queryParameter)) {
        const value = queryParams.get(queryParameter);
        if (input.type === 'checkbox') {
            const values = value.split(',');
            input.checked = values.includes(input.value.toLowerCase());
        } else {
            input.value = value;
        }
        action();
    }
}

/**
 * Performs filtering on the cards based on the search input and selected tags.
 */
function performFilter() {
    const query = searchFilterInput.value.toLowerCase();
    const checkedInputs = document.querySelectorAll('.form-check-input:checked');
    const selectedTags = Array.from(checkedInputs).map(input => input.id.toLowerCase());

    cards.forEach((card) => {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const text = card.querySelector(".card-text").textContent.toLowerCase();
        const tags = card.getAttribute('data-tags').split(',');

        const matchesSearch = title.includes(query) || text.includes(query);
        const matchesTags = selectedTags.length === 0 || tags.some(tag => selectedTags.includes(tag));

        if (matchesSearch && matchesTags) {
            card.parentNode.classList.remove("d-none");
        } else {
            card.parentNode.classList.add("d-none");
        }
    });

    // Update the query parameters
    updateMainUrlQueryStrings((url) => {
        updateQueryStringParameter(url, "search", query);
        updateQueryStringParameter(url, "usecase", selectedTags.join(','));
    });
}

/**
 * Handles the use case chevron animation.
 * @param eventType The event type to handle.
 * @param animationName The animation name to apply.
 * @param oldClass The old class to replace.
 * @param newClass The new class to replace with.
 */
function handleUseCaseAnimation(eventType, animationName, oldClass, newClass) {
    useCaseContent.addEventListener(eventType, function () {
        chevronIcon.style.animationName = animationName;
        chevronIcon.classList.add('spinning');
        chevronIcon.classList.replace(oldClass, newClass);
    });

    useCaseContent.addEventListener(eventType.replace('hide', 'hidden').replace('show', 'shown'), function () {
        chevronIcon.classList.remove('spinning');
    });
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    updateInputsFromQueryParameters();
});

searchFilterInput.addEventListener("input", performFilter);
logoInput.addEventListener("change", updateLogo);
primaryColorInput.addEventListener("change", updatePrimaryColor);
primaryColorDarkInput.addEventListener("change", updatePrimaryColorDark);
primaryForegroundColorInput.addEventListener("change", updatePrimaryForegroundColor);
optionalAppNameInput.addEventListener("change", updateOptionalAppName);
optionalAndroidPublicKeyInput.addEventListener("change", updateOptionalAndroidPublicKey);
optionaliOSPublicKeyInput.addEventListener("change", updateOptionaliOSPublicKey);
useCaseCheckboxInputs.forEach(input => {
    input.addEventListener('change', performFilter);
});
handleUseCaseAnimation('show.bs.collapse', 'spinUp', 'bi-chevron-down', 'bi-chevron-up');
handleUseCaseAnimation('hide.bs.collapse', 'spinDown', 'bi-chevron-up', 'bi-chevron-down');

