# Save Video Recording Example

This sample page showcases how to record and save a video of the embedded device using Appetize JS SDK using [jmuxer](https://github.com/samirkumardas/jmuxer).


### Update Branding / CSS

1. Open the [styles.css](css/styles.css) file and update the root variables to match your branding. To quickly get up and running update the following variables:

    ```css
        --bs-primary: {your brand hex color};
        --bs-primary-dark: {your brand darker hex color};
    ```

2. Update your brand logo by replacing the [frontpage_logo.png](i/frontpage_logo.png) & [frontpage_logo@2x.png](i/frontpage_logo@2x.png) files with your own logo.

### Update Configuration

Open the [config.js](js/config.js) file and update the `config` object to match your application build id.

```js
const config = {
    products: {
        ios: "{ios build id key}",
        android: "{android build id key}",
    }
}
```