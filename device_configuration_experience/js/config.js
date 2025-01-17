// Description: This file contains the configuration for the launch page.

const config = {
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.
    scale: "auto",      // Set to "auto" or "0-100" to change the scale of the device.
    centered: "both",   // Set to "both", "horizontal", or "vertical" to change the centering of the device.
    defaultPlatform: "ios", // Set to "ios" or "android" to change the default platform.

    // App Config
    app: {
        ios: {
            publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
            defaultDevice: "iphone15pro",
        },
        android: {
            publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
            defaultDevice: "pixel8",
        }
    }
    // End of App configuration.
};
