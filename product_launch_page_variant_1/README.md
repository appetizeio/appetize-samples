# Quick Launch Page
This sample page demonstrates how to create a custom launch page by
embedding Appetize to showcase the different apps and/or product features available in your
business.

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
    autoPlay: false,    // Set to true to autoplay the session when a product/platform is selected.
    toast: "top",       // Set to "top" or "bottom" to change the position of the toast message.

    // Start of product configuration
    products: [ 
        {
            name: "{Product Name}",
            ios: {
                publicKey: "{app public key}",
                device: "{preferred device e.g. iphone14pro}",
                customActions: function(client, session) {
                    // Add optional custom actions here that can interact with the session and client.
                }
            },
            android: {
                publicKey: "{app public key}",
                device: "{preferred device e.g. pixel6 }",
            }
        }
    ]
}
```
