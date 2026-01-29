const config = {
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.

    // Start of configuration
    languages: [
        {
            name: "English",
            code: "en"
        },
        {
            name: "Spanish",
            code: "es"
        },
        {
            name: "French",
            code: "fr"
        },
        {
            name: "German",
            code: "de"
        }
    ],
    products: [
        {
            name: "Wikipedia (iOS)",
            publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
            device: "iphone15pro",
            osVersion: "18",
            orientation: "portrait",
            width: "300px",
            customActions: customActions
        },
        {
            name: "Wikipedia (Android)",
            publicKey: "demo_7hzx4sssu7giioyxnw5iwlbrma",
            device: "pixel8",
            osVersion: "15",
            orientation: "portrait",
            width: "300px",
            customActions: customActions
        }
    ],
    // End of configuration.
};

async function customActions(client, session, language) {
    console.log("Running custom actions");
}
