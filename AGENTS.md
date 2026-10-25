# Release policy

The user requires the visible version number to increase with every published update. Current version is in `dist/version.json` (or `version.json` in the GitHub export).

- Before each new user-visible release run `node release-version.cjs YYYYMMDD` once. Increase the minor version (1.1, 1.2, 1.3, and so on).
- Use that version in the page title, splash label, version check, asset URLs, service-worker cache, Sites title and standalone HTML filename.
- Preserve older standalone HTML releases. Keep the PWA identity, local-storage keys and saved high score unchanged.
- Updates on both hosting platforms for the same change share one version.
