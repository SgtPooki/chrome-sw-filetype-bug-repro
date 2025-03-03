# Chrome Service Worker Filename Bug Reproduction

👋 Hi there! This is a minimal reproduction for a Chrome bug where filenames aren't properly populated when saving content served by a Service Worker.

## 🔗 Related Issue

This repository reproduces the bug described in [IPFS Service Worker Gateway issue #574](https://github.com/ipfs/service-worker-gateway/issues/574).

## 🐞 What's the bug?

When a Service Worker serves an image with the correct Content-Type headers, Chrome doesn't suggest the proper filename extension when saving the file.

## 🚀 How to test it yourself

1. Clone this repository
   ```
   git clone https://github.com/SgtPooki/chrome-sw-filetype-bug-repro
   cd chrome-sw-filetype-bug-repro
   ```

2. Start a local server
   ```
   npx http-server -p 8346 .
   ```

3. Open your browser and visit:
   ```
   http://localhost:8346
   ```

4. Wait for the "Service Worker registered successfully!" message and click the green "Load Image from Service Worker" button

5. When the image loads, right-click on it and select "Save image as..."

6. Notice that Chrome suggests a generic filename without the proper .jpg extension, even though the Content-Type is correctly set to "image/jpeg"

## ✅ Expected Behavior

When saving the image, Chrome should suggest a filename with a .jpg extension since the content type is set to "image/jpeg". This currently works in firefox.

## ❌ Actual Behavior

Chrome suggests a generic filename (like "download" or "get") without the proper extension.

## 🔍 Why is this a problem?

This makes for a confusing user experience, as people expect files to have the correct extension matching their content type. It's especially problematic for web applications that serve dynamically generated content through Service Workers.

## 💻 Technical Details

The Service Worker in this demo fetches an image, and serves it with the same content-type headers of working backend gateways. Despite this, Chrome doesn't use the headers to suggest an appropriate filename extension.
