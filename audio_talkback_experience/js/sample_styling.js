const queryParams = new URLSearchParams(window.location.search);
const frontpageLogo = document.getElementById("frontpage_logo");

/**
 * Updates the logo used on the frontpage.
 */
const updateLogoFromQueryParam = () => {
    const logoValue = queryParams.get('logo');
    if (logoValue && frontpageLogo) {
        console.log(`Updating logo to ${logoValue}`);
        frontpageLogo.src = logoValue;
        frontpageLogo.srcset = logoValue;
    }
};

/**
 * Updates a CSS variable from a query parameter.
 * @param variableName The name of the CSS variable.
 * @param queryParamName The name of the query parameter.
 */
const updateCSSVariable = (variableName, queryParamName) => {
    if (queryParams.has(queryParamName)) {
        const value = queryParams.get(queryParamName);
        console.log(`Updating ${variableName} to ${value}`);
        document.documentElement.style.setProperty(variableName, value);
    }
};

/**
 * Updates the config app to match the Android public key passed in the query parameters.
 * Audio output & TalkBack are Android only, so only an Android public key is supported here.
 * Pass one with e.g. ?optionalAndroidPublicKey=your_public_key
 */
function updateConfigApps() {
    const optionalAndroidPublicKey = queryParams.get('optionalAndroidPublicKey');

    if (optionalAndroidPublicKey) {
        config.app.android.publicKey = optionalAndroidPublicKey;
    }

    // Optionally override the sample video, e.g. ?sampleVideoUrl=https://vimeo.com/347119375
    const optionalSampleVideoUrl = queryParams.get('sampleVideoUrl');
    if (optionalSampleVideoUrl) {
        config.sampleVideoUrl = optionalSampleVideoUrl;
    }
}

document.addEventListener('DOMContentLoaded', updateLogoFromQueryParam);
updateCSSVariable('--bs-primary', 'primaryColor');
updateCSSVariable('--bs-primary-dark', 'primaryColorDark');
updateCSSVariable('--bs-foreground', 'primaryForegroundColor');
updateConfigApps();
