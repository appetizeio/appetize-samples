# Save Video Recording Example

This sample showcases how to record, store, download and replay all the interactions done in the embedded Appetize device.


### Update Branding / CSS

1. Open the [styles.css](css/styles.css) file and update the root variables to match your branding. To quickly get up and running update the following variables:

    ```css
        --bs-primary: {your brand hex color};
        --bs-primary-dark: {your brand darker hex color};
    ```

2. Update your brand logo by replacing the [frontpage_logo.png](i/frontpage_logo.png) & [frontpage_logo@2x.png](i/frontpage_logo@2x.png) files with your own logo.

### Update Configuration

Open the [config.js](js/config.js) file and update the `config` object to match your android/ios public key.

```js

const config = {
    products: [
        {
            platform: 'iOS',
            publicKey: '<application public key>'
        },
        {
            platform: 'Android',
            publicKey: '<application public key>'
        },
    ]
}
```