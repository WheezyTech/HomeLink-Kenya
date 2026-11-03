# HomeLink Kenya Android app

The Android app packages the existing HomeLink Kenya React app with Capacitor.

## Download an APK

1. Open the repository's **Actions** tab and select **Build Android APK**.
2. Select **Run workflow**, enter the public backend API URL ending in `/api/`, and start the build.
3. Download `homelink-kenya-android-apk` from the completed workflow run's **Artifacts** section.

To publish a permanent APK download under **Releases**, first add the public HTTPS API URL ending in `/api/` as the repository Actions variable `API_BASE_URL`, then push a version tag such as `v1.0.0`. The workflow builds the APK and attaches it to that release.

After publishing a release, its APK can be downloaded from `https://github.com/WheezyTech/HomeLink-Kenya/releases/latest/download/HomeLink-Kenya.apk`. The workflow builds a debug-signed APK for testing and direct installation; Android may ask users to allow installation from their browser or file manager. Production distribution and seamless app updates require a managed release-signing key.

## Backend requirements

- Deploy the Django API to a publicly reachable HTTPS address before building the APK.
- For workflow builds, provide the URL in the manual workflow input or configure the repository Actions variable `API_BASE_URL`. The URL must end in `/api/`, for example `https://api.example.com/api/`.
- Allow the Capacitor Android WebView origin `https://localhost` in Django's CORS settings. It is included in this project's `CORS_ALLOWED_ORIGINS`.
- Keep `VITE_API_BASE_URL` set to the deployed URL when building the Android app. Local web development defaults to `http://127.0.0.1:8000/api/`.

## Local development

```sh
npm ci
npm run dev
```

To open or sync the Android project, install the Android SDK and run:

```sh
npm run build
npm run android:sync
npm run android:open
```
