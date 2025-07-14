# Event Authentication and Registration Flow

This document explains the authentication and registration flow implemented for events based on access settings.

## Overview

The event registration system now supports different access levels based on event configuration:

1. **Public Events** (`allowLogin: false`) - Anyone can register without authentication
2. **Guest + Login Events** (`allowLogin: true, allowGuest: true`) - Both guests and logged-in users can register
3. **Login Required Events** (`allowLogin: true, allowGuest: false`) - Only logged-in users can register
4. **Member-Only Events** (`allowLogin: true, allowMemberLogin: true`) - Only active members can register

## API Endpoints

### Registration APIs

#### Guest Registration
- **Endpoint**: `POST /events/register/guest`
- **Usage**: For users registering without authentication
- **Request Body**:
```json
{
  "eventId": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "eventData": [
    {
      "fieldName": "string",
      "fieldValue": "string"
    }
  ],
  "price": "string",
  "stripeId": "string",
  "currency": "str",
  "status": "pending",
  "paymentStatus": "unpaid"
}
```

#### Authenticated User Registration
- **Endpoint**: `POST /events/register`
- **Usage**: For authenticated users (requires Authorization header)
- **Request Body**:
```json
{
  "eventId": "string",
  "userId": "string",
  "email": "string",
  "eventData": [
    {
      "fieldName": "string",
      "fieldValue": "string"
    }
  ],
  "price": "string",
  "stripeId": "string",
  "currency": "str",
  "status": "pending",
  "paymentStatus": "unpaid"
}
```

### Payment Success Flow

#### Get Registration Details
- **Endpoint**: `GET /events/register/:registerId`
- **Usage**: Retrieve registration details for payment processing
- **Response**:
```json
{
  "eventId": "string",
  "userId": "string",
  "email": "string",
  "eventData": [
    {
      "fieldName": "string",
      "fieldValue": "string",
      "_id": "string"
    }
  ],
  "price": "string",
  "stripeId": "string",
  "currency": "str",
  "status": "string",
  "paymentStatus": "string",
  "registrationDate": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "_id": "string",
  "__v": 0
}
```

#### Update Payment Status
- **Endpoint**: `PUT /events/update`
- **Usage**: Update registration with payment confirmation
- **Request Body**:
```json
{
  "eventId": "string",
  "userId": "string",
  "email": "string",
  "eventData": [
    {
      "fieldName": "string",
      "fieldValue": "string"
    }
  ],
  "price": "string",
  "stripeId": "string",
  "currency": "str",
  "status": "completed",
  "paymentStatus": "paid"
}
```

## Implementation Details

### Authentication Flow

1. **Component Mount**: Check event access settings and user authentication status
2. **Access Validation**: Use `checkEventAccess()` helper to determine access permissions
3. **Membership Verification**: For member-only events, verify active membership status
4. **Registration**: Use appropriate API based on authentication status

### Key Functions

#### `checkEventAccess(eventData)`
Determines access permissions based on event settings:
- Returns access status, login requirements, and membership requirements
- Handles all access level combinations

#### `decodeAccessToken(token)`
Safely decodes JWT tokens to extract user information:
- Works in both browser and Node.js environments
- Returns user ID for authenticated requests

#### `isAuthenticated()`
Checks if user has valid authentication token

### Registration Form Behavior

1. **Loading State**: Shows authentication checking progress
2. **Error Handling**: Displays appropriate error messages for access restrictions
3. **Success Messages**: Shows confirmation for member access
4. **Conditional Rendering**: Only shows form when access requirements are met

### Payment Success Page

The payment success page now:
1. Retrieves registration details using the registration ID
2. Updates payment status to "paid" and registration status to "completed"
3. Displays comprehensive registration information including:
   - Registration ID and Event ID
   - User email and registration date
   - Payment amount and currency
   - Event-specific data fields
   - Payment and registration status chips

## URL Parameters

### Event Registration
- Standard event page: `/event/[id]`

### Payment Success
- URL: `/payment/success?session_id=xxx&registration_id=xxx&type=event`
- Parameters:
  - `session_id`: Stripe session ID
  - `registration_id`: Event registration ID
  - `type`: Payment type ("event")

## Error Handling

The system handles various error scenarios:
- Invalid or missing authentication tokens
- Insufficient access permissions
- Membership verification failures
- API communication errors
- Missing registration data

## Security Considerations

1. **Token Validation**: All authenticated requests validate JWT tokens
2. **Membership Verification**: Active membership status is verified for restricted events
3. **Access Control**: Event access is strictly enforced based on configuration
4. **Error Messages**: Informative but secure error messages guide users appropriately