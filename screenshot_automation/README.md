# Screenshot Automation
This sample launch showcases how to use the Appetize JS SDK to automate screenshots of your app.

When customizing this sample, it is important to determine the criteria for the screenshot generation. For example:
 - Do you want to capture all of your app's features or a subset of features?
 - Which devices and OS versions do you want to generate screenshots for?
 - Which languages do you want to generate screenshots for?
 - Which orientations do you want to generate screenshots for?
 - Any other scenarios?

For this sample (and illustrative purposes) we have chosen to generate screenshots for both the Android and iOS versions of the app, on multiple device types, and in English and French. 

## :hammer: Getting Started

### Update Branding / CSS

1. Open the [styles.css](css/styles.css) file and update the root variables to match your branding. To quickly get up and running update the following variables:

    ```css
        --bs-primary: {your brand hex color};
        --bs-primary-dark: {your brand darker hex color};
    ```

2. Update your brand logo by replacing the [frontpage_logo.png](i/frontpage_logo.png) & [frontpage_logo@2x.png](i/frontpage_logo@2x.png) files with your own logo.

### Update Configuration

Open the [config.js](js/config.js) file and update the `config` object to match your expected apps and screenshot steps. By default, the following options are available:

```js
    const config = {
   /***
    * The apps to generate screenshots for. Each app will be launched on each device and each language.
    */
   apps: [
      {
         name: "{Display name of app 1}",
         publicKey: "{publicKey of app 1}",

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
               displayName: "{Screen 1}",
               playbackActions: async (client, session, language) => {
                  await automateStepsToGetToThisScreen();
               }
            },
            {
               displayName: "{Screen 2}",
               playbackActions: async (client, session, language) => {
                  await automateStepsToGetToThisScreen();
               }
            }
         ]
      },
      {
         name: "{Display name of app 2}",
         publicKey: "{publicKey of app 2}",
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
                  await automateStepsToGetToThisScreen();
               }
            }
         ]
      }
   ],
};
```
