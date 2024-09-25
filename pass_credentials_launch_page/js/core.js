// Description: Core functions for the launch page.
// Variables

const appetizeIframeName = '#appetize';
const startSessionButton = document.getElementById('start_session');
const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');

// Init Functions

/**
 * Initializes animations for the page.
 */
function initAnimations() {
    AOS.init({
        easing: 'ease-out-cubic', once: true, offset: 120, duration: 650
    });
}

/**
 * Initializes the client and adds the session event listener.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient() {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName);
        console.log('client loaded!');
        window.client.on("session", async session => {
            console.log('session started!')
            try {
                window.session = session;
                await runCustomActions(session);
            } catch (error) {
                console.error(error);
            }
        })
    } catch (error) {
        console.error(error);
    }
}

// Event Handlers

/**
 * Runs any custom actions for the selected app if they exist.
 * @param session The session to run the custom actions on.
 * @returns {Promise<void>} A promise that resolves when the custom actions are complete.
 */
async function runCustomActions(session) {

    // Get username and password values
    var username = usernameField.value;
    var password = passwordField.value;

    // Tab Bar

    await session.findElement({
        attributes: {
            'resource-id': "org.wikipedia:id/nav_more_container"
        }
    })
    await session.tap({
        element: {
            attributes: {
                'resource-id': "org.wikipedia:id/nav_more_container"
            }
        }
    });

    // Bottom Sheet

    await session.findElement({
        attributes: {
            'resource-id': "org.wikipedia:id/main_drawer_account_container"
        }
    });
    await session.tap({
        element: {
            attributes: {
                'resource-id': "org.wikipedia:id/main_drawer_account_container"
            }
        }
    });

    // Sign Up Screen

    await session.findElement({
        attributes: {
            'resource-id': "org.wikipedia:id/create_account_login_button"
        }
    });
    await session.tap({
        element: {
            attributes: {
                'resource-id': "org.wikipedia:id/create_account_login_button"
            }
        }
    });

    // Log In Screen

    await session.findElement({
        attributes: {
            'resource-id': "org.wikipedia:id/login_username_text"
        }
    });
    await session.tap({
        element: {
            attributes: {
                'resource-id': "org.wikipedia:id/login_username_text"
            }
        }
    });

    await session.type(username);
    await session.tap({
        element: {
            attributes: {
                'resource-id': "com.google.android.inputmethod.latin:id/key_pos_ime_action"
            }
        }
    });

    await session.type(password);
    await session.tap({
        element: {
            attributes: {
                'resource-id': "com.google.android.inputmethod.latin:id/key_pos_ime_action"
            }
        }
    });
}

/**
 * Updates the username and password fields with values from the query parameters if available.
 */
const updateCredentialsFromQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const password = urlParams.get('password');
    if (username) {
        usernameField.value = username;
    }
    if (password) {
        passwordField.value = password;
    }
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    initAnimations();
    updateCredentialsFromQueryParams();
    await initClient();
});

// Event Listeners

passwordField.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        startSessionButton.click();
    }
});

startSessionButton.addEventListener('click', async function (event) {
    if (!window.client) {
        return;
    }
    try {
        await window.client.startSession();
    } catch (error) {
        console.error(error);
    }
});
