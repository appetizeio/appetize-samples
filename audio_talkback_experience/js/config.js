// Description: This file contains the configuration for the launch page.

const config = {
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.
    scale: "auto",      // Set to "auto" or "0-100" to change the scale of the device.
    centered: "both",   // Set to "both", "horizontal", or "vertical" to change the centering of the device.
    defaultPlatform: "android", // Audio output & TalkBack are Android only features.
    volume: 1,          // Device volume. A number from 0 to 1 (defaults to 0.5 if omitted).

    // A sample video opened on the device (via session.openUrl) when the user clicks
    // "Open Sample Video". Handy for producing sound to verify audio works — `audio: true`
    // only enables output, it doesn't create a sound source.
    sampleVideoUrl: "https://vimeo.com/347119375",

    // TalkBack is Google's screen reader for Android. The following adb shell commands
    // grant the permissions TalkBack requires and enable the accessibility service.
    // Each entry is the command exactly as it would be passed to `adb shell`; they are run
    // one by one at runtime via session.adbShellCommand once the device is ready.
    talkBackCommands: [
        "pm uninstall io.appetize.automations",
        "pm grant com.google.android.marvin.talkback android.permission.POST_NOTIFICATIONS",
        "pm grant com.google.android.marvin.talkback android.permission.READ_PHONE_STATE",
        "settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService"
    ],

    // App Config
    app: {
        android: {
            // Use any app that can produce sound. You can override it at runtime with
            // ?optionalAndroidPublicKey=your_public_key
            publicKey: "demo_7hzx4sssu7giioyxnw5iwlbrma",
            device: "pixel8",
            osVersion: "15"
        }
    }
    // End of App configuration.
};
