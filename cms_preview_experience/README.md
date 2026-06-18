# CMS Preview Experience

This sample demonstrates how to preview CMS content changes live inside a running app on
Appetize. You build a content payload from a customizable form, and the page pushes it into
the app through a deep link — no rebuild required.

## How it works

1. Pick a platform (iOS or Android). The matching app is loaded in the embedded device.
2. Fill in the form: title, subtitle, badge, hero image URL, theme colors, content blocks and a
   call-to-action label.
3. Click **Launch / Update Preview**. The form is serialized to JSON, encoded as base64url, and
   opened in the app via `session.openUrl("appetize://test/cmsPreviewTest?payload=<base64url JSON>")`.
4. The app decodes the payload and renders the **CMS Preview Test** screen with your content.

Use **Show deep link & JSON payload** to inspect exactly what is sent.

## Configuration

Edit `js/config.js` and replace the placeholder public keys with your own apps:

```js
apps: {
    android: { name: "Android", publicKey: "REPLACE_WITH_ANDROID_PUBLIC_KEY", device: "pixel8", osVersion: "15.0" },
    ios:     { name: "iOS",     publicKey: "REPLACE_WITH_IOS_PUBLIC_KEY",     device: "iphone16pro", osVersion: "18.0" },
}
```

The apps must contain the **CMS Preview Test** screen, which is included in the Appetize
`ios-integration-test` and `android-integration-test` demo apps.

## Payload schema

```json
{
  "title": "Summer Collection",
  "subtitle": "Fresh styles, picked just for you.",
  "badge": "New",
  "imageUrl": "https://example.com/image.jpg",
  "backgroundColor": "#0E1116",
  "textColor": "#FFFFFF",
  "accentColor": "#65E5A6",
  "ctaText": "Shop Now",
  "blocks": [
    { "heading": "Why you'll love it", "body": "..." }
  ]
}
```

All fields are optional — anything omitted falls back to the app's defaults.
