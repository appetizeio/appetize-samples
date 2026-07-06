# TalkBack Experience

This sample page demonstrates how to enable **audio output** and **TalkBack**, Google's
Android screen reader, on an Appetize session. Both features are Android only.

- **Audio** is enabled with the `audio: true` session config flag (applied at session start).
- **TalkBack** is enabled by running a series of `adb shell` commands via the runtime
  `session.adbShellCommand` method, which grant the required permissions and start the
  TalkBack accessibility service.

The TalkBack commands run *after* the session is ready (`session.waitUntilReady`) rather than
via the start-time `adbShellCommand` config flag, so the system has finished booting before
the accessibility service is enabled.

Both audio and TalkBack are enabled by default. The session is not auto-started &mdash; the
embed shows "Tap to Play" and the user starts it when ready. Changing a toggle updates the
launch config via `setConfig` (ending any active session), so the next session the user starts
picks up the new configuration.

## :hammer: Getting Started

### Update Branding / CSS

1. Open the [styles.css](css/styles.css) file and update the root variables to match your branding. To quickly get up
   and running update the following variables:

    ```css
        --bs-primary: {your brand hex color};
        --bs-primary-dark: {your brand darker hex color};
    ```

2. Update your brand logo by replacing the [frontpage_logo.svg](i/frontpage_logo.svg) file with your own logo.

### Update Configuration

Open the [config.js](js/config.js) file and update the `config` object to match your product configuration:

```js
const config = {
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.
    scale: "auto",      // Set to "auto" or "0-100" to change the scale of the device.
    centered: "both",   // Set to "both", "horizontal", or "vertical" to change the centering of the device.
    defaultPlatform: "android", // Audio output & TalkBack are Android only features.

    // adb shell commands used to enable the TalkBack screen reader.
    talkBackCommands: [
        "pm uninstall io.appetize.automations",
        "pm grant com.google.android.marvin.talkback android.permission.POST_NOTIFICATIONS",
        "pm grant com.google.android.marvin.talkback android.permission.READ_PHONE_STATE",
        "settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService"
    ],

    // App Config
    app: {
        android: {
            publicKey: "{app public key}",
            device: "{preferred device e.g. pixel8}",
            osVersion: "{preferred OS version e.g. 15}"
        }
    }
    // End of App configuration.
};
```

### Open Sample Video

`audio: true` only enables audio output &mdash; something on the device still has to make
noise. The page includes an **Open Sample Video** button that opens a sample video on the
running session via `session.openUrl`, giving you something audible to play (the click also
serves as the user gesture browsers require before audio can play). Change the default video
in [config.js](js/config.js) or override it at runtime with a `sampleVideoUrl` query
parameter:

```
launch.html?sampleVideoUrl=https://vimeo.com/347119375
```

### Optionally passing an Android public key

Instead of editing `config.js`, you can override the Android app at runtime by passing an
`optionalAndroidPublicKey` query parameter. This is handled in
[sample_styling.js](js/sample_styling.js):

```
launch.html?optionalAndroidPublicKey=your_public_key
```

When present it replaces `config.app.android.publicKey` before the session starts. (Audio
output and TalkBack are Android only, so only an Android public key is supported.)

### How it works

Audio is applied as a config flag when the session starts:

```js
const sessionConfig = {
    publicKey: "{app public key}",
    device: "pixel8",
    osVersion: "15",
    audio: true,   // (Android only) Enables audio output.
    volume: 1      // Device volume, 0 to 1.
};

await client.startSession(sessionConfig);
```

TalkBack is enabled at runtime, once the device is ready, using the `session.adbShellCommand`
method (`adbShellCommand` accepts a single command, so each one is run in turn):

```js
client.on("session", async session => {
    await session.waitUntilReady();          // wait until the device has booted

    for (const command of config.talkBackCommands) {
        try {
            await session.adbShellCommand(command);
        } catch (error) {
            // e.g. uninstalling a package that isn't installed — keep going.
            console.warn(`adb shell command failed: ${command}`, error);
        }
    }
});
```

Running the commands after `waitUntilReady` (rather than via the start-time `adbShellCommand`
config flag) ensures the system has finished booting before the accessibility service is
enabled. Each command is run independently so a failure doesn't prevent the rest from running.
