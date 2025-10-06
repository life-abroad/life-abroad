
# Life Abroad React Native Mobile App

## Prerequisites

- **Node.js** (latest LTS recommended)
- **npm** (comes with Node.js) or **yarn**
- **Watchman** (macOS): `brew install watchman`
- **Xcode** (from Mac App Store, for iOS)
- **CocoaPods** (for iOS): `sudo gem install cocoapods`
- **Android Studio** (for Android, optional)

## Setup

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd life-abroad/apps/mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and fill in any required values (like API_URL)
   ```

4. **Install iOS native dependencies**

   ```bash
   npx pod-install
   ```

5. **Run the app**

   - iOS Simulator:

     ```bash
     npx react-native run-ios
     ```

   - Android Emulator:

     ```bash
     npx react-native run-android
     ```

6. **(Optional) Run on physical device**
   - For iOS: Open `ios/mobile.xcworkspace` in Xcode, select your device, and click Run.
   - For Android: Connect device, enable USB debugging, and run the Android command above.

7. **Troubleshooting**
   - See the [React Native Environment Setup Guide](https://reactnative.dev/docs/environment-setup) if you hit issues.

## Folder Structure

- `src/features/` — Feature modules (auth, posts, etc.)
- `src/components/` — Reusable UI components
- `src/services/` — API clients, helpers
- `src/navigation/` — Navigation setup

## Production Build

- Use Xcode (iOS) or Android Studio (Android) for release builds.
