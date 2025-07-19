# Quick Setup Guide

## What You Need To Do

### 1. Get Your Supabase Anon Key
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (jajvmughglgaddfizkjy)
3. Go to Settings > API
4. Copy the "anon public" key
5. Replace `your_supabase_anon_key_here` in your `.env` file with the actual key

### 2. Run Database Setup
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy and paste the SQL code from `database/setup.sql`
4. Click "Run" to execute the commands

### 3. Configure Google OAuth (Optional)
1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret)
4. Set redirect URI to: `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`

### 4. Set Site URL
1. Go to Authentication > Settings in Supabase
2. Set Site URL to your domain (e.g., `http://localhost:5173` for development)
3. Add redirect URLs:
   - `http://localhost:5173` (for development)
   - Your production domain

## Features Added

✅ **Email/Password Authentication**
- Users can sign up with email, password, and mobile number
- Users can sign in with email and password

✅ **Google OAuth Authentication** (Optional)
- Users can sign in with Google accounts
- Prompted to add mobile number after Google sign-in

✅ **Usage Limits**
- Anonymous users: 5 free synthesis generations
- Authenticated users: Unlimited generations

✅ **User Profile Management**
- Automatic profile creation
- Mobile number storage (required for Sri Lankan students)
- Synthesis count tracking

## How to Test

1. **Without Authentication**: Try generating 6 synthesis pathways (should show limit after 5)
2. **With Email**: Create an account and verify you have unlimited access
3. **With Google**: Sign in with Google and check mobile number prompt

The app will now show authentication options and track usage limits!
