# Launch Params Experience

This sample demonstrates how to pass custom launch parameters to your app when starting an Appetize session.

## Features

- **Color Theme Selection**: Choose between Light (0), Dark (1), Black (2), or Sepia (3) themes
- **Skip Onboarding Toggle**: Option to skip the onboarding flow when launching the app
- **Dynamic Parameter Passing**: Launch parameters are passed to the app via the `params` object in the session configuration

## How it Works

The sample uses the Appetize SDK to:

1. Initialize a session with the configured app
2. Allow users to select launch parameters via UI controls
3. Restart the session with the selected parameters using `client.restartSession()`

The parameters are passed as:

```javascript
{
    colorTheme: "0" | "1" | "2" | "3",  // Selected theme value
    skipOnboarding: true | false         // Whether to skip onboarding
}
```

## Customization

To adapt this sample for your own app:

1. Update the `publicKey` in `js/config.js` with your app's public key
2. Modify the parameter inputs in `launch.html` to match your app's needs
3. Update the `launchAppWithParams()` function in `js/core.js` to build your custom params object
4. Ensure your app handles the launch parameters appropriately

## Key Files

- `launch.html`: Main page with UI controls for launch parameters
- `js/config.js`: Configuration including app public key
- `js/core.js`: Core logic for handling session and launch parameters
- `css/styles.css`: Styling for the page and form controls
