// Description: This file contains the configuration for the launch page.

const config = {
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.
    scale: "auto",      // Set to "auto" or "0-100" to change the scale of the device.
    centered: "both",   // Set to "both", "horizontal", or "vertical" to change the centering of the device.
    defaultPlatform: "android", // Set to "ios" or "android" to change the default platform.

    // App Config
    app: {
        ios: {
            publicKey: "demo_ea5a5c67z2eqszqkb64wu6t6ta",
            defaultDevice: "iphone15pro",
            osVersion: "18"
        },
        android: {
            publicKey: "demo_7hzx4sssu7giioyxnw5iwlbrma",
            defaultDevice: "pixel8",
            osVersion: "15"
        }
    }
    // End of App configuration.
};
