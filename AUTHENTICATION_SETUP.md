# Supabase Authentication Setup Guide

## 1. Database Setup

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  mobile_number TEXT,
  synthesis_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 2. Authentication Configuration

### In your Supabase Dashboard:

1. **Go to Authentication > Settings**
2. **Site URL**: Set to your domain (e.g., `http://localhost:5173` for development)
3. **Redirect URLs**: Add the following URLs:
   - `http://localhost:5173/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### Google OAuth Setup:

1. **Go to Authentication > Providers**
2. **Enable Google provider**
3. **Add your Google OAuth credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" and create OAuth 2.0 Client IDs
   - Set Authorized redirect URIs to: `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

## 3. Environment Variables

Update your `.env` file with the correct Supabase anon key:

```env
GEMINI_API_KEY=AIzaSyAayJt5gJdBF1Udd_qhaiDnypZhFo1oKrc

# Supabase Configuration
VITE_SUPABASE_URL=https://jajvmughglgaddfizkjy.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

You can find your anon key in Supabase Dashboard > Settings > API.

## 4. Features Implemented

### Email/Password Authentication
- **Sign Up**: Users can create accounts with email, password, and mobile number
- **Sign In**: Users can log in with email and password
- **Email Verification**: Users need to verify their email addresses

### Google OAuth Authentication
- **Google Sign In**: Users can sign in with their Google accounts
- **Mobile Number Collection**: After Google sign-in, users are prompted to provide mobile number

### Usage Limits
- **Anonymous Users**: Can generate up to 5 synthesis pathways
- **Authenticated Users**: Unlimited synthesis generations
- **Usage Tracking**: Counts are stored in localStorage for anonymous users, database for authenticated users

### User Profile Management
- **Profile Creation**: Automatic profile creation on first sign-in
- **Mobile Number**: Required field for Sri Lankan students
- **Synthesis Count Tracking**: Tracks how many synthesis pathways user has generated

## 5. How It Works

1. **Anonymous Usage**: 
   - Users can use the app without signing in
   - Limited to 5 synthesis generations
   - Count stored in localStorage

2. **Sign Up Flow**:
   - User provides email, password, and mobile number
   - Account created and email verification sent
   - Profile automatically created in database

3. **Google Sign In Flow**:
   - User clicks "Continue with Google"
   - Redirects to Google OAuth
   - After authentication, returns to app
   - If no mobile number, prompts user to provide it

4. **Synthesis Generation**:
   - Checks if user can create synthesis (under limit or authenticated)
   - If over limit, shows modal prompting to sign in
   - After successful generation, increments count

## 6. Security Features

- **Row Level Security**: Users can only access their own data
- **Secure Authentication**: Uses Supabase's built-in auth system
- **Environment Variables**: Sensitive keys stored in environment variables
- **Email Verification**: Users must verify email addresses

## 7. Testing

1. **Anonymous User**:
   - Try generating 5+ synthesis pathways
   - Should show limit modal after 5 attempts

2. **Email Sign Up**:
   - Create account with email/password
   - Check email for verification link
   - Should have unlimited access after verification

3. **Google Sign In**:
   - Sign in with Google account
   - Should prompt for mobile number
   - Should have unlimited access

## 8. Troubleshooting

### "redirect_uri_mismatch" Error:
- Ensure redirect URL is properly configured in both Google Cloud Console and Supabase
- Check that the URL exactly matches: `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`

### Database Errors:
- Ensure all SQL commands were executed successfully
- Check that RLS policies are properly configured
- Verify that the trigger function is created

### Authentication Not Working:
- Check environment variables are properly set
- Verify Supabase anon key is correct
- Ensure Google OAuth credentials are properly configured
