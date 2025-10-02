# Noctis 🌙

A beautiful dream journal application built with React Native, Expo, and Supabase.

## ✨ Features

### 🎨 Beautiful Welcome Screen
- Animated confetti effect on first load
- Gradient background with elegant logo
- Smooth transitions between auth screens
- Introductory text explaining the app

### 🔐 Complete Authentication System
- **Welcome Screen**: First impression with logo and call-to-action buttons
- **Sign Up**: Create account with:
  - First name and last name (required)
  - Email address (required)
  - Password with confirmation (required, min 6 characters)
  - Profile photo (optional)
- **Login**: Simple email/password authentication
- **Protected Routes**: Automatic navigation based on auth state

### 👤 User Profile Management
- View and manage profile information
- First name, last name, email display
- Optional profile photo
- Secure sign-out functionality

### 🏗️ Modern Architecture
- **File-based routing** with Expo Router
- **Component-based structure** for maintainability
- **TypeScript** for type safety
- **NativeWind (Tailwind CSS)** for styling
- **Supabase** for authentication and database
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
│   ├── auth/                    # Auth components
│   │   ├── Logo.tsx            # App logo component
│   │   ├── ConfettiEffect.tsx  # Animated confetti
│   │   ├── IntroText.tsx       # Welcome text
│   │   ├── CTAButtons.tsx      # Call-to-action buttons
│   │   ├── LoginForm.tsx       # Login form
│   │   ├── SignUpForm.tsx      # Signup form with photo
│   │   └── index.ts            # Component exports
│   └── BottomNavbar.tsx         # Bottom navigation
│
├── providers/                    # Context providers
│   └── AuthContext.tsx          # Authentication context
│
├── supabase/                     # Supabase configuration
│   ├── client.ts                # Supabase client setup
│   └── schema.sql               # Database schema
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
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd noctis
   ```

2. **Install dependencies**
   
   If you encounter npm cache permission errors, see [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) for solutions.
   
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the SQL Editor
   - Get your project URL and anon key

4. **Configure environment variables**
   
   Create a `.env` file:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

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

## 🗄️ Database Schema

The app uses the following main tables:

- **profiles**: User profile information (first_name, last_name, email, avatar_url)
- **dreams**: Dream journal entries
- **user_settings**: User preferences and settings

See `supabase/schema.sql` for the complete schema with RLS policies.

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
- [Installation Guide](./INSTALL_GUIDE.md) - Troubleshooting installation issues
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [NativeWind Docs](https://www.nativewind.dev/)

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.com/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

