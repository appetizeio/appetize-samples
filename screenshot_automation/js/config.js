// Description: This file contains the configuration for the screenshot launch template.

const config = {
    /***
     * The apps to generate screenshots for. Each app will be launched on each device and each language.
     */
    apps: [
        {
            name: "Wikipedia iOS",
            publicKey: "br5maalpifnd645entluves3oi",

            /**
             * The devices to generate screenshots for.
             */
            devices: [
                {
                    displayName: "iPhone 14 Pro",
                    device: "iphone14pro",
                    osVersion: "16.2",
                },
                {
                    displayName: "iPhone 12",
                    device: "iphone12",
                    osVersion: "16.2",
                }
            ],
            /**
             * The languages to generate screenshots for.
             */
            languages: [
                "en", "fr"
            ],

            /**
             * The screens to generate screenshots for. Each screen will be navigated to and a screenshot will be taken.
             * Assume that the app might already be launched and that you need to re-navigate to the screen.
             */
            screens: [
                {
                    displayName: "Explore",
                    playbackActions: async (client, session, language) => {
                        console.log('Explore Playback actions');
                        const exploreScreenElements = await session.findElements({
                            attributes: {
                                'accessibilityLabel': "wikipedia"
                            }
                        })
                        if (exploreScreenElements.length === 0) {
                            await session.tap({
                                    element: {
                                        attributes: {
                                            "accessibilityLabel": getString(language, "explore")
                                        }
                                    }
                                }
                            );
                        }
                        await session.findElement({
                            attributes: {
                                'accessibilityLabel': "wikipedia"
                            }
                        });
                        await waitForTimeout(5000);
                    }
                },
                {
                    displayName: "Places",
                    playbackActions: async (client, session, language) => {
                        console.log('Places Playback actions');
                        await session.tap({
                                element: {
                                    attributes: {
                                        "accessibilityLabel": getString(language, "places")
                                    }
                                }
                            }
                        );

                        async function hasLocationDialog() {
                            const locationDialogElements = await session.findElements({
                                attributes: {
                                    "accessibilityLabel": getString(language, "enableLocation")
                                }
                            })
                            return locationDialogElements.length > 0
                        }

                        async function allowLocationPermissions() {
                            await session.tap({
                                    element: {
                                        attributes: {
                                            "accessibilityLabel": getString(language, "enableLocation")
                                        }
                                    }
                                }, {matchIndex: 0}
                            );
                            await session.tap({
                                    element: {
                                        attributes: {
                                            "accessibilityLabel": "Allow While Using App"
                                        }
                                    }
                                }
                            );
                        }

                        if (await hasLocationDialog()) {
                            await allowLocationPermissions();
                        } else {
                            await session.tap({
                                    element: {
                                        attributes: {
                                            "accessibilityLabel": getString(language, "recenter")
                                        }
                                    }
                                }
                            );
                            if (await hasLocationDialog()) {
                                await allowLocationPermissions();
                            }
                        }
                        await waitForTimeout(5000);
                    }
                }
            ]
        },
        {
            name: "Wikipedia Android",
            publicKey: "mxiz2hqjh6rrhtngt6mcy2qlnu",
            devices: [
                {
                    displayName: "Pixel 7",
                    device: "pixel7",
                    osVersion: "13.0",
                },
                {
                    displayName: "Galaxy Tab S7",
                    device: "galaxytabs7",
                    osVersion: "13.0",
                }
            ],
            languages: [
                "en", "fr"
            ],
            screens: [
                {
                    displayName: "Explore",
                    playbackActions: async (client, session, language) => {
                        console.log('Explore Playback actions');
                        await session.findElement({
                            attributes: {
                                'resource-id': "org.wikipedia:id/nav_tab_explore"
                            }
                        });
                        await waitForTimeout(5000);
                    }
                }
                ]
        }
    ],

    // End of app configuration.
};

/**
 * For the demo app we don't control the accessibility Ids, so we use accessibility labels instead, however this means we need to
 * use different labels for different languages.
 */
const languageStrings = {
    en: {
        places: "Places",
        explore: "Explore",
        enableLocation: "Enable location",
        recenter: "Recenter on your location"
    },
    fr: {
        places: "Lieux",
        explore: "Explorer",
        enableLocation: "Activer la localisation",
        recenter: "Recentrer sur votre emplacement"
    }
};

/**
 * Gets a string for a given language and key.
 * @param language The language to get the string for.
 * @param key The key of the string to get.
 * @returns {*} The string for the given language and key or the default English string if the language is not found.
 */
function getString(language, key) {
    if (languageStrings.hasOwnProperty(language) && languageStrings[language].hasOwnProperty(key)) {
        return languageStrings[language][key];
    }

    if (languageStrings.en.hasOwnProperty(key)) {
        return languageStrings.en[key];
    }

    return key;
}

/**
 * Waits for a timeout.
 * @param ms The number of milliseconds to wait.
 * @returns {Promise<unknown>} A promise that resolves when the timeout is complete.
 */
const waitForTimeout = (ms) => new Promise(r => setTimeout(r, ms))