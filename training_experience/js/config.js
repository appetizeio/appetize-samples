const config = {
    // Start of tutorial configuration
    tutorials: [
        {
            title: "How to log in on the Wikipedia app",
            description: "This tutorial will show you how to log in on the Wikipedia app.",
            buttonTitle: "Get Started",
            publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
            device: "pixel7",
            osVersion: "14",
            successTitle: "You're logged in!",
            successDescription: "You've successfully completed the tutorial! Now you know how to log in on the Wikipedia app.",
            steps: [
                {
                    title: "Tap on the more button in the toolbar",
                    description: "This will open the navigation drawer.",
                    validate: async (session, action) => {
                        const tappedIcon = validateTapAction(action, {
                            'resource-id': 'org.wikipedia:id/menu_icon'
                        })
                        const tappedText = validateTapAction(action, {
                            'text': 'More'
                        })
                        const tappedContainer = validateTapAction(action, {
                            'resource-id': 'org.wikipedia:id/nav_more_container'
                        })
                        return tappedIcon || tappedText || tappedContainer;
                    }
                },
                {
                    title: "Select the Log in / join Wikipedia option",
                    description: "This will take you to the Create an account screen.",
                    validate: async (session, action) => {
                        return validateTapAction(action, {
                            'resource-id': 'org.wikipedia:id/main_drawer_login_button'
                        })
                    }
                },
                {
                    title: "Select Log in",
                    description: "As we want to log in with an existing account, select the 'Log in' option at the bottom of the screen.",
                    validate: async (session, action) => {
                        return validateTapAction(action, {
                            'resource-id': 'org.wikipedia:id/create_account_login_button'
                        })
                    }
                },
                {
                    title: "Fill in your username",
                    description: "For this demo, let's fill in 'demo@appetize.io'.",
                    validate: async (session, action) => {
                        return await validateTextInput(session, {
                            class: 'android.widget.EditText',
                            text: 'demo@appetize.io'
                        }, 'demo@appetize.io');
                    }
                },
                {
                    title: "Fill in your password",
                    description: "For this demo, let's fill in 'demo'.",
                    validate: async (session, action) => {
                        return validateTextInput(session, {
                            class: 'android.widget.EditText',
                            text: 'demo'
                        }, 'demo');
                    }
                },
                {
                    title: "Tap on the Log In button",
                    validate: async (session, action) => {
                        return validateTapAction(action, {
                            'resource-id': 'org.wikipedia:id/login_button'
                        })
                    }
                }
            ]
        },
        {
            title: "Search for articles on the Wikipedia app",
            description: "This tutorial will show you how to search for articles on the Wikipedia app.",
            buttonTitle: "Let's Go",
            publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
            device: "pixel7",
            osVersion: "14",
            successTitle: "You read your first article!",
            successDescription: "You've successfully completed the tutorial! Now you know how to search for articles on Wikipedia.",
            steps: [
                {
                    title: "Tap on the search bar",
                    description: "This will open the search screen.",
                    validate: async (session, action) => {
                        const textView =  validateTapAction(action, {
                            'text': 'Search Wikipedia',
                            'class': 'android.widget.TextView'
                        })
                        const container = validateTapAction(action,{
                            "resource-id": "org.wikipedia:id/search_container"
                        });
                        return textView || container;
                    }
                },
                {
                    title: "Search for 'apple'",
                    description: "Type 'apple' in the search bar. This will show you a list of articles related to apples.",
                    validate: async (session, action) => {
                        return validateTextInput(session, {
                            'resource-id': 'org.wikipedia:id/search_src_text',
                            text: 'apple'
                        }, 'apple');
                    }
                },
                {
                    title: "Select the article 'Apple'",
                    description: "Tap on the article 'Apple' from the list of search results.",
                    validate: async (session, action) => {
                        const title = validateTapAction(action, {
                            'text': 'Apple',
                            'resource-id': 'org.wikipedia:id/page_list_item_title'
                        })
                        const description = validateTapAction(action, {
                            'text': 'Fruit that grows on a tree',
                            'resource-id': 'org.wikipedia:id/page_list_item_description'
                        })
                        const image = validateTapAction(action, {
                            // This one won't be perfect, but it's good enough for the demo.
                            'resource-id': 'org.wikipedia:id/page_list_item_image'
                        })
                        return title || description || image;
                    }
                }
            ]
        },
        {
            title: "Save articles on the Wikipedia app",
            description: "This tutorial will show you how to save articles on the Wikipedia app.",
            buttonTitle: "Learn to save",
            publicKey: "demo_r0m5r98axtdhftx1hmmhq1c0m8",
            device: "pixel7",
            osVersion: "14",
            successTitle: "You saved your first article!",
            successDescription: "You've successfully completed the tutorial! Now you know how to save articles on Wikipedia.",
            steps: [
                {
                    title: "Tap on the search bar",
                    description: "This will open the search screen.",
                    validate: async (session, action) => {
                        const textView =  validateTapAction(action, {
                            'text': 'Search Wikipedia',
                            'class': 'android.widget.TextView'
                        })
                        const container = validateTapAction(action,{
                            "resource-id": "org.wikipedia:id/search_container"
                        });
                        return textView || container;
                    }
                },
                {
                    title: "Search for 'apple'",
                    description: "Type 'apple' in the search bar. This will show you a list of articles related to apples.",
                    validate: async (session, action) => {
                        return validateTextInput(session, {
                            'resource-id': 'org.wikipedia:id/search_src_text',
                            text: 'apple'
                        }, 'apple');
                    }
                },
                {
                    title: "Select the article 'Apple'",
                    description: "Tap on the article 'Apple' from the list of search results.",
                    validate: async (session, action) => {
                        const title = validateTapAction(action, {
                            'text': 'Apple',
                            'resource-id': 'org.wikipedia:id/page_list_item_title'
                        })
                        const description = validateTapAction(action, {
                            'text': 'Fruit that grows on a tree',
                            'resource-id': 'org.wikipedia:id/page_list_item_description'
                        })
                        const image = validateTapAction(action, {
                            // This one won't be perfect, but it's good enough for the demo.
                            'resource-id': 'org.wikipedia:id/page_list_item_image'
                        })
                        return title || description || image;
                    }
                },
                {
                    title: "Select the 'Save' button",
                    description: "This will save the article to your saved list.",
                    validate: async (session, action) => {
                        try {
                            await session.findElement({
                                attributes: {
                                    'text': 'Saved Apple. Do you want to add it to a list?',
                                    'resource-id': 'org.wikipedia:id/snackbar_text'
                                }
                            });
                            return true;
                        } catch (e) {
                            return false
                        }
                    }
                }
            ]
        }
    ],
    // End of product configuration.
};

/**
 * Helper function to validate a tap action.
 * @param action The action to validate.
 * @param expectedAttributes The expected attributes of the action.
 * @returns {boolean} True if the action is a tap action with the expected attributes, false otherwise.
 */
function validateTapAction(action, expectedAttributes) {
    if (action.type !== 'tap') {
        return false;
    }

    const attributes = action.element.attributes;

    for (const key in expectedAttributes) {
        if (expectedAttributes[key] !== attributes[key]) {
            return false;
        }
    }

    return true;
}

/**
 * Helper function to validate a type action.
 * @param session The session to run the validation on.
 * @param textViewElementAttributes The attributes of the text view element to validate
 * @param expectedText The expected text of the text view element
 * @returns {Promise<boolean>} True if the text view element has the expected text, false otherwise.
 */
async function validateTextInput(session, textViewElementAttributes, expectedText) {
    try {
        const element = await session.findElement({
            attributes: textViewElementAttributes
        });

        console.log(element);
        return element.attributes.text === expectedText;
    } catch (e) {
        console.log('Error validating text input: ' + e);
        return false;
    }
}
