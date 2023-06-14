// Description: Core functions for Sample Page.

// Init Functions

/**
 * Initializes animations for the page.
 */
function initAnimations() {
    AOS.init({
        easing: 'ease-out-cubic', once: true, offset: 120, duration: 650
    });
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
});