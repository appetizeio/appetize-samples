# Language Picker Launch Page Experience
If your app supports multiple languages, this sample demonstrates how to create a language
picker experience that can be used to change the language of your app.

## :hammer: Getting Started

### Update Branding / CSS

1. Open the [styles.css](css/styles.css) file and update the root variables to match your branding. To quickly get up and running update the following variables:

    ```css
        --bs-primary: {your brand hex color};
        --bs-primary-dark: {your brand darker hex color};
    ```

2. Update your brand logo by replacing the [frontpage_logo.png](i/frontpage_logo.png) & [frontpage_logo@2x.png](i/frontpage_logo@2x.png) files with your own logo.

### Update Configuration

Open the [config.js](js/config.js) file and update the `config` object to match your product configuration. The following options are available:

```js
const config = {
   toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.

   // Start of configuration
   
   // List of supported languages
   languages: [
      {
         name: "{Language Name e.g English}",
         code: "{Language Code e.g en}"
      },
      {
         name: "Spanish",
         code: "es"
      },
      {
         name: "French",
         code: "fr"
      },
      {
         name: "German",
         code: "de"
      }
   ],
   products: [
      {
         name: "App Name",
         publicKey: "{app public key}",
         device: "{preferred device e.g. iphone14pro}"
         osVersion: "{preferred OS version e.g. 17}",
         orientation: "{preferred orientation e.g. portrait}",
         width: "{preferred width e.g. 300px}",
         customActions: customActions // Optional custom actions to execute after the app has launched.
      }
   ],
   // End of configuration.
};
```
