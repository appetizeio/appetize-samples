// Description: Core functions for the training template.
// Variables

const appetizeIframeName = '#appetize';
const tutorialActionsContainer = document.getElementById('tutorialActions');
const tutorialContent = document.getElementById('tutorialContent');
const tutorialSelection = document.getElementById('tutorialSelection');
const tutorialContentCloseButton = document.querySelector('#tutorialContent .btn-close');
const tutorialSteps = document.getElementById('tutorialSteps');
const successModal = document.getElementById('successModal');

let selection = {
    tutorial: null
}

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
 * Initializes the tutorial cards.
 */
async function initTutorials() {
    const tutorialActions = config.tutorials.map((tutorial, i) => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-white', 'ps-3', 'pe-3', 'pt-2', 'pb-2', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h4');
        title.classList.add('card-title');
        title.innerText = tutorial.title;
        cardBody.appendChild(title);

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.innerText = tutorial.description;
        cardBody.appendChild(description);

        const button = createButton(tutorial.buttonTitle, `selectTutorial(${i});`);
        button.classList.add('btn', 'btn-primary', 'tutorialButton');

        card.appendChild(cardBody);

        const footer = document.createElement('div');
        footer.classList.add('card-footer');
        footer.appendChild(button);

        card.appendChild(footer);

        const column = document.createElement('div');
        column.classList.add('col', 'mb-3');
        column.appendChild(card);

        return column;
    });

    tutorialActionsContainer.replaceChildren(...tutorialActions);
}


/**
 * Initializes the client and adds the session event listener.
 * @returns {Promise<void>} A promise that resolves when the client is loaded.
 */
async function initClient(config) {
    try {
        console.log(`Loading client for ${appetizeIframeName}`);
        window.client = await window.appetize.getClient(appetizeIframeName, config);
        console.log('client loaded!');
        window.client.on("session", async session => {
            console.log('session started!')
            try {
                window.session = session;
                subscribeToSessionEvents(session);
            } catch (error) {
                console.error(error);
                window.session = null;
                resetUI();
            }
        })
    } catch (error) {
        window.client = null;
        console.error(error);
        resetUI();
    }
}

/**
 * Resets the UI to the tutorial selection screen.
 */
function resetUI() {
    selection.tutorial = null;
    showAndHideWithAnimation(tutorialSelection, tutorialContent);
}

/**
 * Subscribes to the relevant session events for the given session.
 * @param session The session to subscribe to.
 */
function subscribeToSessionEvents(session) {
    session.on('action', async (action) => {
        console.log('user action occurred');
        await validateUserAction(session, action);
    });
    session.on('disconnect', () => {
        console.log('disconnect');
        resetUI();
    });
}

/**
 * Validates the given user action for the active step.
 * @param session The session to validate the action for.
 * @param action The action to validate.
 * @returns {Promise<void>} A promise that resolves when the action is validated.
 */
async function validateUserAction(session, action) {
    const activeStepIndex = findActiveStepIndex();
    const activeStep = selection.tutorial.steps[activeStepIndex];
    console.log("Validating step " + activeStepIndex);
    if (!activeStep) {
        console.error(`No active step found`);
        return;
    }

    console.log(action);
    if (await activeStep.validate(session, action)) {
        completeStep(activeStepIndex);
    }
}

/**
 * Finds the index of the active step.
 * @returns {number} The index of the active step, or -1 if no step is active.
 */
function findActiveStepIndex() {
    const stepsArray = Array.from(tutorialSteps.children);
    return stepsArray.findLastIndex(step => !step.classList.contains('disabled'));
}

/**
 * Selects the tutorial at the given index if it hasn't already been selected.
 * @param index The index of the tutorial to select. -1 to deselect.
 * @param shouldUpdateSession Whether or not to update the session after selecting the tutorial.
 */
async function selectTutorial(index, shouldUpdateSession = true) {
    if (index === -1) {
        console.log(`Deselecting tutorial`);
        selection.tutorial = null;
        await updateSession();
        return;
    }

    const tutorial = config.tutorials[index];
    if (selection.tutorial === tutorial) {
        console.log(`Already selected ${tutorial.title}`)
        return;
    }

    selection.tutorial = tutorial;
    console.log(`Selecting ${tutorial.title}`);

    const allButtons = document.querySelectorAll('.tutorialButton');
    allButtons.forEach(button => {
        disableButton(button);
        hideSpinner(button);
    });

    const clickedButton = allButtons[index];
    showSpinner(clickedButton);

    loadTutorialSteps(tutorial);
    showAndHideWithAnimation(tutorialContent, tutorialSelection);

    if (shouldUpdateSession) {
        await updateSession();
    }

    allButtons.forEach(button => {
        enableButton(button);
        hideSpinner(button);
    });
}

/**
 * Adds the steps of the given tutorial to the tutorialSteps list-group.
 * @param {Object} tutorial The tutorial whose steps to add.
 */
function loadTutorialSteps(tutorial) {
    tutorialSteps.innerHTML = ''; // Clear any existing steps
    tutorial.steps.forEach((step, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
        // If it's not the first step, add the 'disabled' class
        if (index !== 0) {
            listItem.classList.add('disabled');
        }
        //listItem.innerHTML = `<strong>${step.title}</strong>`;
        const subheading = document.createElement('div');
        subheading.classList.add('ms-2', 'me-auto');

        const heading = document.createElement('div');
        heading.classList.add('fw-bold');
        heading.innerHTML = step.title;
        subheading.appendChild(heading);

        if (step.description) {
            subheading.innerHTML += step.description;
        }

        listItem.appendChild(subheading);

        // Add success icon on the right.
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('d-flex', 'align-items-center');
        iconContainer.innerHTML = `<i class="bi bi-check-lg d-none"></i>`;
        listItem.appendChild(iconContainer);

        tutorialSteps.appendChild(listItem);
    });
}


/**
 * Marks a step as completed.
 * @param {number} stepIndex The index of the step to mark as completed.
 */
function completeStep(stepIndex) {
    const tutorialSteps = document.getElementById('tutorialSteps');
    const step = tutorialSteps.children[stepIndex];
    if (step) {
        step.classList.remove('disabled');
        step.classList.add('list-group-item-success');
        const badge = step.querySelector('.bi-check-lg');
        if (badge) {
            badge.classList.remove('d-none');
        }
        // Enable the next step
        const nextStep = tutorialSteps.children[stepIndex + 1];
        if (nextStep) {
            nextStep.classList.remove('disabled');
        } else {
            showSuccessModal(selection.tutorial.successTitle, selection.tutorial.successDescription);
        }
    }
}

/**
 * Updates the session with the selected app.
 * @returns {Promise<void>} A promise that resolves when the client exists.
 */
async function updateSession() {
    try {
        const selectedTutorial = selection.tutorial;

        if (!selectedTutorial) {
            console.log(`No tutorial selected.`);
            if (window.session) {
                await window.session.end();
            } else {
                resetUI();
            }
            return;
        }

        const sessionConfig = {
            publicKey: selectedTutorial.publicKey,
            device: selectedTutorial.device,
            osVersion: selectedTutorial.osVersion,
            centered: 'both',
            scale: 'auto',
            record: true,
        };

        if (!window.client) {
            await initClient(sessionConfig);
        }

        console.log(selection);
        const session = await window.client.startSession(sessionConfig);
        console.log(session);

    } catch (error) {
        console.error(error);
    }
}

/**
 * Creates a button with the given text and onClick function.
 * @param text The text to display on the button
 * @param onClick The function to call when the button is clicked
 * @returns {HTMLButtonElement} The button element.
 */
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.setAttribute('onClick', onClick);
    button.setAttribute('class', 'btn btn-primary material-button');
    button.setAttribute('role', 'button');
    button.setAttribute('type', 'button');
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2 d-none" role="status" aria-hidden="true"></span> ${text}`;
    return button;
}

/**
 * Disables the given button.
 * @param button The button to disable.
 */
function disableButton(button) {
    button.classList.add('disabled');
}

/**
 * Enables the given button.
 * @param button The button to enable.
 */
function enableButton(button) {
    button.classList.remove('disabled');
}

/**
 * Shows the spinner on the given button.
 * @param {HTMLElement} button The button to show the spinner on.
 */
function showSpinner(button) {
    const spinner = button.querySelector('.spinner-border');
    spinner.classList.remove('d-none');
    spinner.classList.add('d-inline-block');
}

/**
 * Hides the spinner on the given button.
 * @param {HTMLElement} button The button to hide the spinner on.
 */
function hideSpinner(button) {
    const spinner = button.querySelector('.spinner-border');
    spinner.classList.remove('d-inline-block');
    spinner.classList.add('d-none');
}

/**
 * Shows the success modal with the given title and description.
 * @param title The title of the success modal.
 * @param description The description of the success modal.
 */
function showSuccessModal(title, description) {
    const bsSuccessModal = new bootstrap.Modal(successModal);
    successModal.querySelector('.modal-title').textContent = title;
    successModal.querySelector('.modal-body').textContent = description;
    bsSuccessModal.show();

    window.confetti.addConfetti();
}

/**
 * Shows one element with a fade-in animation and hides another with a fade-out animation.
 * @param {HTMLElement} showElement The element to show.
 * @param {HTMLElement} hideElement The element to hide.
 */
function showAndHideWithAnimation(showElement, hideElement) {
    // Element to show
    showElement.classList.add('show');
    showElement.classList.remove('d-none');

    // Element to hide
    hideElement.classList.remove('show');

    // Add event listener for transitionend event
    hideElement.addEventListener('transitionend', function handler() {
        hideElement.removeEventListener('transitionend', handler);
        hideElement.classList.add('d-none');
    });
}

// On Page Load

document.addEventListener("DOMContentLoaded", async function () {
    window.confetti = new JSConfetti();
    initAnimations();
    await initTutorials();
    await new Promise(res => {
        let i = setInterval(() => {
            if (window.appetize.getClient) {
                clearInterval(i)
                res()
            }
        }, 100)
    })
    tutorialContentCloseButton.addEventListener('click', function () {
        selectTutorial(-1);
    });
    successModal.addEventListener('hidden.bs.modal', function () {
        selectTutorial(-1);
    });
});