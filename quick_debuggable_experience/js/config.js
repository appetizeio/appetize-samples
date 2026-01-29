// Description: This file contains the configuration for the launch template.

const config = {
    autoPlay: false,    // Set to true to autoplay the session when a product/platform is selected.
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.

    // Start of product configuration
    products: [
        {
            name: "Wikipedia",
            ios: {
                publicKey: "demo_ea5a5c67z2eqszqkb64wu6t6ta",
                device: "iphone15pro",
            },
            android: {
                publicKey: "demo_7hzx4sssu7giioyxnw5iwlbrma",
                device: "pixel8",
            }
        }
    ],
    // End of product configuration.
};
