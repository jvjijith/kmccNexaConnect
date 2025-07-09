# Bearer Token Authentication Implementation

## Overview
This document describes the implementation of Bearer token authentication for the `submitMembershipApplication` function in the membership page.

## Changes Made

### Modified File: `apps/web/app/membership/page.tsx`

#### Updated `handleSubmit` Function
- Added access token retrieval from localStorage
- Implemented conditional Bearer token authentication
- Modified the `submitMembershipApplication` call to include Authorization header when token is available

#### Implementation Details

```typescript
// Get access token from localStorage
const accessToken = localStorage.getItem("accessToken");

// Submit membership application with Bearer token if available
const membershipResponse = accessToken 
  ? await submitMembershipApplication(membershipData, {
      "Authorization": `Bearer ${accessToken}`
    })
  : await submitMembershipApplication(membershipData)
```

## How It Works

1. **Token Retrieval**: The function retrieves the access token from localStorage using `localStorage.getItem("accessToken")`

2. **Conditional Authentication**: 
   - If an access token exists, it calls `submitMembershipApplication` with the Authorization header containing the Bearer token
   - If no access token exists, it calls `submitMembershipApplication` without additional headers

3. **Header Format**: The Authorization header follows the standard Bearer token format: `"Authorization": "Bearer ${accessToken}"`

## API Integration

The implementation leverages the existing API infrastructure:
- Uses the `submitMembershipApplication` function from `src/data/loader.ts`
- Passes headers through the `postApi` utility function in `src/utils/api.ts`
- The `postApi` function merges custom headers with default headers before making the request

## Security Benefits

- **Authentication**: Ensures that membership applications are submitted with proper user authentication
- **Authorization**: Allows the backend to verify user permissions and associate the application with the correct user
- **Session Management**: Integrates with the existing authentication system using localStorage token storage

## Error Handling

- The existing error handling in the `handleSubmit` function remains unchanged
- If the API call fails due to authentication issues, the error will be caught and displayed to the user
- The function gracefully handles cases where no access token is available

## Testing

The implementation has been tested with:
- ✅ Successful build compilation
- ✅ No TypeScript errors or warnings
- ✅ Maintains existing functionality when no token is present
- ✅ Proper conditional logic for token inclusion

## Usage

The Bearer token authentication is automatically applied when:
1. A user is logged in (access token exists in localStorage)
2. The user submits a membership application
3. The token is automatically included in the API request headers

No additional changes are required for the user interface or user experience.