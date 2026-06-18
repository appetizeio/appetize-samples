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
            publicKey: "REPLACE_WITH_ANDROID_PUBLIC_KEY",
            device: "pixel8",
            osVersion: "15.0",
        },
        ios: {
            name: "iOS",
            publicKey: "REPLACE_WITH_IOS_PUBLIC_KEY",
            device: "iphone16pro",
            osVersion: "18.0",
        },
    },

    // Which platform is selected on load.
    defaultPlatform: "android",

    // The deep link path that opens the CMS Preview Test on both apps.
    // The encoded payload is appended as ?payload=<base64url(JSON)>.
    deepLinkBase: "appetize://test/cmsPreviewTest",

    // Content that pre-populates the form on load.
    defaultContent: {
        title: "Summer Collection",
        subtitle: "Fresh styles, picked just for you.",
        badge: "New",
        ctaText: "Shop Now",
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
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
