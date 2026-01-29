// Samples list
// All the available samples with the required attrs to generate the card
const samples = [
    {
        title: "Quick Launch Page",
        subtitle: "Variant 1",
        description: "This sample page demonstrates how to create a custom launch page by embedding Appetize to showcase the different apps and/or product features available in your business.",
        tags: ["demo engineering", "support", "testing"],
        sample: "product_launch_page_variant_1/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/product_launch_page_variant_1"
    },
    {
        title: "Quick Launch Page",
        subtitle: "Variant 2",
        description: "This sample page demonstrates how to create a custom launch page by embedding Appetize to showcase the different apps and/or product features available in your business.",
        tags: ["demo engineering", "support", "testing"],
        sample: "product_launch_page_variant_2/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/product_launch_page_variant_2"
    },
    {
        title: "Device Configuration Experience",
        description: "This sample page demonstrates how you can fetch all the available devices Appetize has to offer as well as how you can specify device configurations such as model, Operating System, orientation and much more!",
        tags: ["demo engineering", "support", "testing"],
        sample: "device_configuration_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/device_configuration_experience"
    },
    {
        title: "Device Configuration Experience",
        subtitle: "With Dark Mode & Font Scaling",
        description: "This sample page shows how to fetch all available devices from Appetize and configure them, including model, OS, orientation, dark mode, and font scaling.",
        tags: ["demo engineering", "support", "testing"],
        sample: "device_configuration_experience_variant_2/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/device_configuration_experience_variant_2"
    },
    {
        title: "Deep Link Experience",
        description: "This sample page demonstrates how to create a custom launch page that can be used to launch a deep link to your app.",
        tags: ["demo engineering", "support", "testing"],
        sample: "deep_link_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/deep_link_experience"
    },
    {
        title: "Launch Params Experience",
        description: "This sample page demonstrates how to pass custom launch parameters to your app when starting an Appetize session, such as color themes and configuration options.",
        tags: ["demo engineering", "support", "testing"],
        sample: "launch_params_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/launch_params_experience"
    },
    {
        title: "Pass Credentials Launch Page",
        description: "This sample page demonstrates how to create a custom launch page that can automatically pass in user credentials to any app and log in that user.",
        tags: ["support", "testing"],
        sample: "pass_credentials_launch_page/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/pass_credentials_launch_page"
    },
    {
        title: "Screenshot Automation",
        description: "This sample showcases how to use the Appetize JS SDK to automate screenshots of your app.",
        tags: ["demo engineering", "training", "support", "testing"],
        sample: "screenshot_automation/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/screenshot_automation"
    },
    {
        title: "Training Experience",
        description: "This sample page demonstrates how to create a custom training experience that can be used to train users on how to use your app.",
        tags: ["training", "support"],
        sample: "training_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/training_experience"
    },
    {
        title: "Language Picker Experience",
        description: "If your app supports multiple languages, this sample demonstrates how to create a language picker experience that can be used to change the language of your app.",
        tags: ["demo engineering", "support", "testing"],
        sample: "language_picker_launch_page/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/language_picker_launch_page"
    },
    {
        title: "Storybook Samples",
        description: "These samples showcase how you can use Appetize inside Storybook to showcase your app and/or app components in a Storybook environment.",
        tags: ["demo engineering", "support", "testing"],
        sample: "https://storybookjs.github.io/native/",
        sourceCode: "https://github.com/storybookjs/native"
    },
    {
        title: "Quick Debuggable Experience",
        subtitle: "Includes screenshot and logs exporting",
        description: "This sample page demonstrates how to create a custom launch page by embedding Appetize to showcase the different apps and/or product features available in your business. It also includes the ability to take screenshots and download network, debug and AppRecorder logs.",
        tags: ["demo engineering", "support", "testing"],
        sample: "quick_debuggable_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/quick_debuggable_experience"
    },
    {
        title: "Record and Playback Actions Experience",
        subtitle: "Includes actions exporting",
        description: "This sample page demonstrates how to create a custom launch that can be used to record all the actions done in the device and how to replay them after.",
        tags: ["demo engineering", "support", "testing"],
        sample: "record_and_playback_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/record_and_playback_experience"
    },
    {
        title: "Video Recording Experience",
        subtitle: "Includes video recording download",
        description: "This sample page showcases how to record and save a video of the embedded device using Appetize JS SDK.",
        tags: ["demo engineering", "support"],
        sample: "save_video_recording_experience/launch.html",
        sourceCode: "https://github.com/appetizeio/appetize-samples/tree/main/save_video_recording_experience"
    },
    {
        title: "Testing with Playwright",
        subtitle: "Mobile and Web E2E Testing",
        description: "Reliably End-to-End test your Android and iOS mobile applications or web applications with Playwright and Appetize AppRecorder.",
        tags: ["testing", "support"],
        sampleButtonText: "Overview",
        sourceCodeButtonText: "Getting Started",
        sample: "https://docs.appetize.io/testing",
        sourceCode: "https://docs.appetize.io/testing/getting-started"
    }
]