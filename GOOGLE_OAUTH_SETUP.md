# Google OAuth Setup Guide

## Problem
You're getting a `redirect_uri_mismatch` error because Google doesn't recognize the Supabase callback URL.

## Solution Steps

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create a new one)
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add these Authorized redirect URIs:
     ```
     https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback
     http://localhost:5173
     http://localhost:3000
     ```
5. **Copy the Client ID and Client Secret**

### 2. Supabase Configuration

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → Providers**
3. **Enable Google Provider**
4. **Add your Google OAuth credentials**:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
5. **Confirm the redirect URL is**: `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`

### 3. Test the Setup

1. **Save all configurations**
2. **Wait 5-10 minutes** for changes to propagate
3. **Test Google sign-in** in your app

## Important Notes

- The redirect URI in Google Cloud Console must **exactly match** the one Supabase provides
- It can take a few minutes for Google OAuth changes to take effect
- Make sure you're using the correct project in Google Cloud Console
- The Client ID and Secret must be correctly entered in Supabase

## If Still Not Working

1. **Double-check the redirect URI** is exactly: `https://jajvmughglgaddfizkjy.supabase.co/auth/v1/callback`
2. **Verify the Google project** has the Google+ API enabled
3. **Check that OAuth consent screen** is configured (if required)
4. **Wait 10-15 minutes** and try again

## Development vs Production

- **Development**: Add `http://localhost:5173` and `http://localhost:3000`
- **Production**: Add your actual domain callback URL when you deploy
