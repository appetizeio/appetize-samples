# Pass Credentials Launch Page

This sample page demonstrates how to create a custom launch page that can via our JavaScript SDK automatically pass in
user credentials to any app and log in that user.

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

### Update iframe Src

Open the [launch.html](launch.html) file and update the `src` of the iframe to match your preferred embed link (and add
any additional query parameters as required).
