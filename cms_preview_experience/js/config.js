// Description: Configuration for the CMS preview experience template.
//
// Replace the placeholder publicKeys below with the public keys of the iOS and
// Android builds of the AppetizeTest integration app (the apps that contain the
// "CMS Preview Test" entry).

const config = {
    toast: "top",

    // The app to load for each platform. Swap the publicKeys for your own apps.
    apps: {
        android: {
            name: "Android",
            publicKey: "b_i6aterm5f4k4rpyabfinrg4gk4",
            device: "pixel8",
            osVersion: "15",
        },
        ios: {
            name: "iOS",
            publicKey: "b_sjphmoor4q35iyx6ak6i43ce5e",
            device: "iphone16pro",
            osVersion: "18",
        },
    },

    // Which platform is selected on load.
    defaultPlatform: "ios",

    // The deep link path that opens the CMS Preview Test on both apps.
    // The encoded payload is appended as ?payload=<base64url(JSON)>.
    deepLinkBase: "appetize://test/cmsPreviewTest",

    // Content that pre-populates the form on load.
    defaultContent: {
        title: "Summer Collection",
        subtitle: "Fresh styles, picked just for you.",
        badge: "New",
        ctaText: "Shop Now",
        imageUrl: "https://appetize.io/_astro/why_flexible.Du0Cu7QV_Z2avaL3.webp",
        backgroundColor: "#0E1116",
        textColor: "#FFFFFF",
        accentColor: "#65E5A6",
        blocks: [
            {
                heading: "Why you'll love it",
                body: "Lightweight, breathable fabrics designed for warm days and cool nights.",
            },
            {
                heading: "Free returns",
                body: "Not the right fit? Return any item within 30 days, on us.",
            },
        ],
    },
};
