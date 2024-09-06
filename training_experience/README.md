# Training Experience

This sample page demonstrates how to create a training experience for your product(s)
by making use of Appetize's AppRecorder.
The page is designed
to be a straightforward to use template that can be customized to match your branding and product configuration.

## :hammer: Getting Started

### Update Branding / CSS

1. Open the [styles.css](css/styles.css) file and update the root variables to match your branding. To quickly get up
   and running update the following variables:

    ```css
        --bs-primary: {your brand hex color};
        --bs-primary-dark: {your brand darker hex color};
    ```

2. Update your brand logo by replacing
   the [frontpage_logo.png](i/frontpage_logo.png) & [frontpage_logo@2x.png](i/frontpage_logo@2x.png) files with your own
   logo.

### Update Configuration

Open the [config.js](js/config.js) file and update the `config` object to match your product and training configuration.
The following options are available:

```js
    const config = {
   // Start of tutorial configuration
   tutorials: [
      {
         title: "{Your Tutorial Title}",
         description: "{Your Tutorial Description}",
         buttonTitle: "{Your Button Title}",
         publicKey: "{Your Appetize app publicKey}",
         device: "{Your preferred device .e.g pixel7}",
         osVersion: "{Your preferred os version .e.g 14}",
         successTitle: "{Your Success Title used in the success modal}",
         successDescription: "{Your Success Description used in the success modal}",
         steps: [ // Steps to be completed in the tutorial.
            {
               title: "{Your Step Title}",
               description: "{Your Step Description}",
               validate: async (session, action) => { // session is the current session, action is the current action that was performed
                    // Your validation logic here
                    // return true if the step is completed, false otherwise.
                    return true;
               }
            },
            // ... Add more steps here
         ]
      },
      // ... Add more tutorials here
    ]
```
