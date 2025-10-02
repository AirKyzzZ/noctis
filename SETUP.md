# Noctis - Setup Instructions

## 📦 Installation

After cloning the repository, you need to install the required packages:

```bash
npm install
```

If you encounter npm cache permission errors, try one of these solutions:

```bash
# Option 1: Clear npm cache
npm cache clean --force
npm install

# Option 2: Install with sudo (macOS/Linux)
sudo npm install

# Option 3: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm install
```

## 🗄️ Database Setup

The app uses Supabase for authentication and data storage. You need to run the SQL schema on your Supabase instance:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the contents of `supabase/schema.sql`

This will create:
- `profiles` table with first_name, last_name, email, and avatar_url
- `dreams` table for storing dream entries
- `user_settings` table for user preferences
- Necessary RLS policies and triggers

## 🔑 Environment Variables

Create a `.env` file in the root directory (or configure via `app.config.ts`):

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 📱 Features

- **Welcome Screen**: Beautiful gradient background with animated confetti, logo, and call-to-action buttons
- **Authentication**: Complete login/sign-up system with Supabase
- **User Profile**: First name, last name, email, and optional photo
- **Protected Routes**: Automatic navigation based on authentication state
- **Tab Navigation**: Home, Search, Notifications, and Profile screens

## 🏗️ Architecture

The app uses:
- **Expo Router** for file-based routing
- **NativeWind (Tailwind CSS)** for styling
- **Supabase** for authentication and database
- **TypeScript** for type safety
- **Component-based architecture** for better maintainability

### Folder Structure

```
app/
  ├── (auth)/           # Authentication group (welcome, login, signup)
  │   ├── _layout.tsx
  │   └── welcome.tsx
  ├── (tabs)/           # Main app tabs (protected)
  │   ├── _layout.tsx
  │   ├── index.tsx     # Home
  │   ├── search.tsx
  │   ├── notifications.tsx
  │   └── profile.tsx
  └── _layout.tsx       # Root layout with auth provider

components/
  ├── auth/             # Auth-related components
  │   ├── Logo.tsx
  │   ├── ConfettiEffect.tsx
  │   ├── IntroText.tsx
  │   ├── CTAButtons.tsx
  │   ├── LoginForm.tsx
  │   └── SignUpForm.tsx
  └── BottomNavbar.tsx

providers/
  └── AuthContext.tsx   # Authentication context and provider
```

## 🎨 Customization

- Logo: Replace `assets/full_white_transparent.png` with your logo
- Colors: Update gradient colors in `app/(auth)/welcome.tsx`
- Confetti: Customize colors and count in `components/auth/ConfettiEffect.tsx`
- Intro text: Edit `components/auth/IntroText.tsx`

## 🧪 Testing

```bash
npm test
```

## 📝 License

0BSD

