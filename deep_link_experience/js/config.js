// Description: This file contains the configuration for the deep link experience template.

const config = {
    toast: "top",
    android: {
        publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
        device: "pixel8",
    },

    // Start of deep link configuration
    deepLinks: [
        {
            name: "Welcome to Wikipedia",
            deepLink: "wikipedia://en.wikipedia.org",
        },
        {
            name: "Contact Us",
            deepLink: "wikipedia://en.wikipedia.org/wiki/Wikipedia:Contact_us",
        },
        {
            name: "Help Page",
            deepLink: "wikipedia://en.wikipedia.org/wiki/Help:Contents",
        },
        {
            name: "Contents Page",
            deepLink: "wikipedia://en.wikipedia.org/wiki/Wikipedia:Contents",
        },
    ],
};
