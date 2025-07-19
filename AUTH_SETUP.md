# Authentication Setup Instructions

## 1. Supabase Setup

### Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `database/setup.sql`

### Google OAuth Setup
1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID: Get from Google Cloud Console
   - Client Secret: Get from Google Cloud Console
4. Set the redirect URL to: `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`

### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`
   - `http://localhost:5173` (for local development)

## 2. Environment Variables

Update your `.env` file with your Supabase anon key:

```env
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

You can find your anon key in Supabase Dashboard > Settings > API

## 3. Features

### For Non-Authenticated Users
- 5 free synthesis generations
- Count tracked in localStorage
- Prompted to sign in after limit reached

### For Authenticated Users
- Unlimited synthesis generations
- Profile stored in database
- Mobile number collection (required for Sri Lankan students)
- Synthesis count tracking

## 4. Components Added

- `AuthModal.tsx` - Login/signup modal with Google OAuth
- `SynthesisLimitModal.tsx` - Modal shown when limit reached
- `AuthContext.tsx` - Authentication context provider
- Updated `Header.tsx` - Shows auth status and synthesis count
- Updated `App.tsx` - Integrated authentication flow

## 5. Database Schema

### Profiles Table
- `id` (UUID) - References auth.users(id)
- `email` (TEXT) - User's email
- `mobile_number` (TEXT) - Required for Sri Lankan students
- `synthesis_count` (INTEGER) - Number of syntheses created
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 6. Security

- Row Level Security (RLS) enabled
- Users can only access their own profiles
- Automatic profile creation on signup
- Secure authentication flow through Supabase

## 7. Usage Limits

- Anonymous users: 5 synthesis generations (localStorage)
- Authenticated users: Unlimited generations (database tracked)
- Mobile number required for Sri Lankan students during signup
