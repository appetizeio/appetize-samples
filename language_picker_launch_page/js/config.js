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
            device: "iphone14pro",
            osVersion: "17",
            orientation: "portrait",
            width: "300px",
            customActions: customActions
        },
        {
            name: "Wikipedia (Android)",
            publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
            device: "pixel6",
            osVersion: "13",
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
