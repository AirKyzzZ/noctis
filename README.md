# Noctis 🌙

A beautiful dream journal application built with React Native and Expo. All data is stored locally on your device.

## ✨ Features

### 🎨 Beautiful Welcome Screen
- Animated confetti effect on first load
- Gradient background with elegant logo
- Simple "Enter App" button to get started
- Introductory text explaining the app

### 💾 Local-First Architecture
- **No backend required**: All data stored locally using AsyncStorage
- **Offline-first**: Works completely offline
- **Privacy-focused**: Your data never leaves your device
- **Simple entry**: One tap to start using the app

### 🏗️ Modern Architecture
- **File-based routing** with Expo Router
- **Component-based structure** for maintainability
- **TypeScript** for type safety
- **NativeWind (Tailwind CSS)** for styling
- **AsyncStorage** for local data persistence
- **Context API** for state management

## 📁 Project Structure

```
noctis/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication group
│   │   ├── _layout.tsx          # Auth layout
│   │   └── welcome.tsx          # Welcome/Login/Signup screen
│   ├── (tabs)/                   # Main app (protected)
│   │   ├── _layout.tsx          # Tabs layout
│   │   ├── index.tsx            # Home screen
│   │   ├── search.tsx           # Search screen
│   │   ├── notifications.tsx    # Notifications screen
│   │   └── profile.tsx          # Profile screen
│   └── _layout.tsx              # Root layout
│
├── components/                   # Reusable components
│   ├── auth/                    # Welcome screen components
│   │   ├── Logo.tsx            # App logo component
│   │   ├── ConfettiEffect.tsx  # Animated confetti
│   │   ├── IntroText.tsx       # Welcome text
│   │   └── index.ts            # Component exports
│   └── BottomNavbar.tsx         # Bottom navigation
│
├── providers/                    # Context providers
│   └── AuthContext.tsx          # App state context
│
├── utils/                        # Utility functions
│   └── imagePicker.ts           # Image picker helper
│
└── assets/                       # Images, fonts, etc.
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd noctis
   ```

2. **Install dependencies**
   
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

That's it! No backend setup, no database configuration, no environment variables needed.

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📱 Running the App

```bash
# Development server
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 💾 Local Storage

All app data is stored locally using AsyncStorage:
- App state (whether the user has entered the app)
- Any future features will also use local storage
- No external database or internet connection required

## 🎨 Customization

### Change Colors
- Welcome screen gradient: `app/(auth)/welcome.tsx`
- Confetti colors: `components/auth/ConfettiEffect.tsx`
- Theme colors: `tailwind.config.js`

### Change Logo
Replace `assets/full_white_transparent.png` with your logo

### Change Text
- Welcome text: `components/auth/IntroText.tsx`
- Button labels: `components/auth/CTAButtons.tsx`

## 🧪 Testing

```bash
npm test
```

## 📄 License

0BSD - Free to use for any purpose

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

