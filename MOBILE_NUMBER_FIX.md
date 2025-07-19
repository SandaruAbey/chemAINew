# Mobile Number Storage Fix

## Issues Identified and Fixed

### Problem
The mobile number was not being saved to the Supabase `auth.users` table's `phone` field due to several issues:

### Root Causes

1. **Incorrect Phone Format**: Supabase expects phone numbers in international format (e.g., `+94771234567`) but the code was passing local format (`0771234567`)

2. **Timing Issue**: The code was trying to update the user's phone field immediately after signup, but the user might not be fully authenticated yet

3. **Session State**: The `updateUser` call was failing because the user session wasn't properly established

### Solutions Implemented

#### 1. Fixed Phone Number Format
- Convert Sri Lankan mobile numbers from local format (`0771234567`) to international format (`+94771234567`)
- Added proper conversion logic in signup and update functions

#### 2. Improved Timing
- Moved phone field update to `fetchProfile` function which runs after user is properly authenticated
- Added `updateAuthUserPhone` helper function for consistent phone updates

#### 3. Enhanced Error Handling
- Better error logging for debugging phone update issues
- Graceful fallback when phone update fails

### Code Changes Made

#### In `signUpWithEmail`:
```typescript
// Convert to international format
const internationalMobile = cleanMobile.startsWith('0') 
  ? `+94${cleanMobile.substring(1)}` 
  : `+94${cleanMobile}`;

// Store both formats in user metadata
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      mobile_number: cleanMobile,  // Local format for profiles table
      phone: internationalMobile, // International format for auth
    },
  },
});
```

#### In `fetchProfile`:
```typescript
// Update auth user phone field if not already set
if (data.mobile_number && !user?.phone) {
  await updateAuthUserPhone(data.mobile_number);
}
```

#### New Helper Function:
```typescript
const updateAuthUserPhone = async (mobileNumber: string) => {
  // Convert to international format and update auth.users phone field
  const internationalMobile = mobileNumber.startsWith('0') 
    ? `+94${mobileNumber.substring(1)}` 
    : `+94${mobileNumber}`;
  
  await supabase.auth.updateUser({
    phone: internationalMobile,
    data: { mobile_number: mobileNumber }
  });
};
```

### Testing the Fix

1. **Sign Up**: Create a new account with mobile number
2. **Check Database**: Verify the phone field is populated in `auth.users` table
3. **Profile Update**: Update mobile number and verify it updates the phone field
4. **Google Sign-in**: Ensure mobile number collection works for Google users

### Expected Behavior

- Mobile numbers should be saved in both:
  - `profiles.mobile_number` (local format: `0771234567`)
  - `auth.users.phone` (international format: `+94771234567`)
- Phone field updates should happen automatically when user signs up or updates profile
- Error handling should provide clear feedback if updates fail

### Notes

- Phone format follows Sri Lankan numbering (+94 country code)
- Can be easily adapted for other countries by changing the country code
- The fix ensures backward compatibility with existing data
