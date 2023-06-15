// Description: This file contains the configuration for the launch template.

const config = {
    autoPlay: false,    // Set to true to autoplay the session when a product/platform is selected.
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.

    // Start of product configuration
    products: [
        {
            name: "Wiki (Explore)",
            ios: {
                publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
                device: "iphone14pro",
            },
            android: {
                publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
                device: "pixel6",
            }
        },
        {
            name: "Wiki (Places)",
            ios: {
                publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
                device: "iphone14",
                customActions: wikiPlacesIosCustomActions
            }
        },
        {
            name: "Wiki (Search)",
            ios: {
                publicKey: "demo_phq04c56jnvrkg0bn9w5ep4m9r",
                device: "iphone14pro",
                customActions: wikiSearchIosCustomActions
            },
            android: {
                publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
                device: "pixel6",
                customActions: wikiSearchAndroidCustomActions
            }
        },
        {
            name: "Product 4",
        }
    ],
    // End of product configuration.
};

// Start of Custom Actions

/**
 * Runs custom actions for Wikipedia on iOS to navigate to the places tab.
 * @param client The client to run the custom actions on.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function wikiPlacesIosCustomActions(client, session) {
    console.log('Wiki Places iOS custom action called');
    await session.tap({
            element: {
                attributes: {
                    "accessibilityLabel": "Places"
                }
            }
        }
    );
    await session.tap({
            element: {
                attributes: {
                    "accessibilityLabel": "Enable location"
                }
            },
            options: {
                matchIndex: 0
            }
        }
    );
    await session.tap({
            element: {
                attributes: {
                    "accessibilityLabel": "Allow Once"
                }
            }
        }
    );
}

/**
 * Runs custom actions for Wikipedia on iOS to navigate to the search tab.
 * @param client The client to run the custom actions on.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function wikiSearchIosCustomActions(client, session) {
    console.log('Wiki Search iOS custom action called');
    await session.tap({
            element: {
                attributes: {
                    "accessibilityLabel": "Search"
                }
            }
        }
    );
}

/**
 * Runs custom actions for Wikipedia on Android to navigate to the search tab.
 * @param client The client to run the custom actions on.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function wikiSearchAndroidCustomActions(client, session) {
    console.log('Wiki Search Android custom action called');
    await session.tap({
            element: {
                attributes: {
                    "content-desc": "Search"
                }
            }
        }
    );
}
