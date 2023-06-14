// Description: This file contains the configuration for the launch template.

const config = {
    autoPlay: false,    // Set to true to autoplay the session when a product/platform is selected.
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.

    // Start of product configuration
    products: [
        {
            name: "Product 1",
            ios: {
                publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
                device: "iphone14pro",
            },
            android: {
                publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
                device: "pixel6",
                customActions: product1AndroidCustomActions
            }
        },
        {
            name: "Product 2",
            ios: {
                publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
                device: "iphone14",
            }
        },
        {
            name: "Product 3",
        },
        {
            name: "Product 4",
        }
    ],
    // End of product configuration.
};

// Start of Custom Actions

/**
 * Runs custom actions for Product 1 on Android.
 * @param client The client to run the custom actions on.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function product1AndroidCustomActions(client, session) {
    console.log('Product 1 custom action called');
    /* await session.tap({
            element: {
                attributes: {
                    "resource-id": "id_username"
                }
            }
        }
    );
    */
}
