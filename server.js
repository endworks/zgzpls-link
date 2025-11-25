const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const APP_STORE_APP_ID = process.env.APP_STORE_APP_ID;
const APP_STORE_URL = process.env.APP_STORE_URL;
const PLAY_STORE_PACKAGE_NAME = process.env.PLAY_STORE_PACKAGE_NAME;
const PLAY_STORE_URL = process.env.PLAY_STORE_URL;

let finalAppStoreUrl;
if (APP_STORE_APP_ID) {
  finalAppStoreUrl = `https://apps.apple.com/app/id${APP_STORE_APP_ID}`;
} else if (APP_STORE_URL) {
  finalAppStoreUrl = APP_STORE_URL;
} else {
  console.error(
    "ERROR: Either APP_STORE_APP_ID or APP_STORE_URL environment variable is required"
  );
  process.exit(1);
}

let finalPlayStoreUrl;
if (PLAY_STORE_PACKAGE_NAME) {
  finalPlayStoreUrl = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_NAME}`;
} else if (PLAY_STORE_URL) {
  finalPlayStoreUrl = PLAY_STORE_URL;
} else {
  console.error(
    "ERROR: Either PLAY_STORE_PACKAGE_NAME or PLAY_STORE_URL environment variable is required"
  );
  process.exit(1);
}

const normalizeUserAgent = (userAgent) => (userAgent || "").toLowerCase();

const isIOSDevice = (userAgent) => {
  const ua = normalizeUserAgent(userAgent);
  return /iphone|ipad|ipod/.test(ua);
};

const isMacOSDevice = (userAgent) => {
  const ua = normalizeUserAgent(userAgent);
  const isiOS = isIOSDevice(userAgent);
  return !isiOS && (ua.includes("macintosh") || ua.includes("mac os x"));
};

app.get("/", (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const isIOS = isIOSDevice(userAgent);
  const isMacOS = isMacOSDevice(userAgent);

  const redirectToAppStore = isIOS || isMacOS;
  const redirectUrl = redirectToAppStore ? finalAppStoreUrl : finalPlayStoreUrl;

  console.log(
    `Device: ${redirectToAppStore ? "App Store" : "Play Store"}, ` +
      `macOS: ${isMacOS}, User-Agent: ${userAgent.substring(0, 50)}...`
  );
  res.redirect(301, redirectUrl);
});

app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/detect", (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const isIOS = isIOSDevice(userAgent);
  const isMacOS = isMacOSDevice(userAgent);
  const redirectToAppStore = isIOS || isMacOS;

  res.json({
    isIOS,
    isMacOS,
    userAgent,
    redirectTo: redirectToAppStore ? "App Store" : "Play Store",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test`);
  console.log(`App Store URL: ${finalAppStoreUrl}`);
  console.log(`Play Store URL: ${finalPlayStoreUrl}`);
});
