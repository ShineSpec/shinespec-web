# Password Reset Feature Setup Guide

## Overview
The password reset feature allows users to reset their password using WhatsApp verification. When a user requests a password reset, the system generates a 6-digit code and sends it to all admin WhatsApp numbers. Admins then manually send the code to users. Admins can view all password reset requests and codes in the admin dashboard.

## Features
1. **User Password Reset Flow**:
   - User enters email on reset password page
   - System generates 6-digit verification code
   - Code is automatically sent to all admin WhatsApp numbers
   - Admin manually sends code to user via WhatsApp
   - User enters code and new password
   - Password is updated upon successful verification

2. **Admin Dashboard**:
   - View all active password reset requests
   - See user details (name, email, phone)
   - **See the verification code** (with copy button)
   - Track request timestamps and expiration times
   - Monitor active vs expired requests
   - Codes are automatically sent to admin phones when requests are made

## Backend Setup

### 1. Environment Variables
Add these to your `.env` file:

```bash
# WhatsApp Configuration (choose one provider)

# Option 1: Twilio WhatsApp
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Option 2: ChatAPI
WHATSAPP_PROVIDER=chatapi
CHATAPI_URL=https://api.chatapi.com/instance12345/sendMessage
CHATAPI_TOKEN=your_chatapi_token

# Option 3: Custom Webhook (most flexible)
WHATSAPP_PROVIDER=webhook
WHATSAPP_WEBHOOK_URL=https://your-whatsapp-service.com/api/send
WHATSAPP_WEBHOOK_TOKEN=your_webhook_token  # Optional
```

**Note**: If no WhatsApp provider is configured, the system will log messages to the console in development mode, allowing you to test the flow without actual WhatsApp integration.

### 2. Database Changes
The User model has been updated with the following fields:
- `passwordResetCode`: 6-digit verification code
- `passwordResetCodeExpires`: Expiration timestamp (15 minutes)
- `passwordResetRequestedAt`: Request timestamp

### 3. API Endpoints

#### Public Endpoints (No authentication required)
- `POST /api/auth/request-password-reset`
  - Body: `{ "email": "user@example.com" }`
  - Response: `{ "message": "If an account with that email exists, you will receive a verification code from our support team shortly." }`
  - **Note**: Code is sent to admin WhatsApp numbers, not directly to user

- `POST /api/auth/verify-password-reset`
  - Body: `{ "email": "user@example.com", "code": "123456", "newPassword": "newpassword123" }`
  - Response: `{ "message": "Password reset successful. You can now login with your new password." }`

#### Admin Endpoints (Requires admin authentication)
- `GET /api/admin/password-reset-requests`
  - Response: `{ "requests": [...], "total": 5 }`
  - Returns all active password reset requests
  - **Includes the verification code** so admin can send it to users

## Frontend Setup

### Routes
- `/reset-password` - Password reset page (two-step flow)
- Login page now includes a "Forgot your password?" link

### Admin Dashboard
- New "Password Resets" tab in admin dashboard
- Displays all active password reset requests
- Shows user details, request time, expiration time, and status

## How It Works

1. **User requests password reset** → Enters email on `/reset-password` page
2. **System generates code** → 6-digit code is created and saved to database
3. **Code sent to admins** → All admin WhatsApp numbers receive the code automatically
4. **Admin sends to user** → Admin manually sends the code to user via WhatsApp
5. **User verifies** → User enters code and new password on reset page
6. **Password updated** → Code is cleared and password is reset

## WhatsApp Integration Options

**Note**: WhatsApp integration is used to send codes to **admins**, not directly to users.

### Option 1: Twilio WhatsApp API
1. Sign up at https://www.twilio.com/
2. Get your Account SID and Auth Token
3. Set up a WhatsApp-enabled phone number
4. Configure environment variables

### Option 2: ChatAPI
1. Sign up at https://chatapi.com/
2. Create an instance
3. Get your API URL and token
4. Configure environment variables

### Option 3: Custom Webhook
1. Set up your own WhatsApp service
2. Create an endpoint that accepts:
   ```json
   {
     "phone": "+27123456789",
     "message": "Your code is: 123456",
     "type": "text"
   }
   ```
3. Configure `WHATSAPP_WEBHOOK_URL` in `.env`

## Security Features
- Verification codes expire after 15 minutes
- Codes are single-use (cleared after successful reset)
- User existence is not revealed (same message for existing/non-existing users)
- Password must be at least 6 characters
- Admin can monitor all reset requests for security

## Testing
1. Navigate to `/reset-password`
2. Enter a registered user's email
3. **As admin**: Check your WhatsApp for the code (or check admin dashboard)
4. **As admin**: Send the code to the user via WhatsApp
5. **As user**: Enter the code and new password on the reset page
6. Login with the new password
7. **As admin**: Check the "Password Resets" tab to see all requests and codes

## Troubleshooting

### WhatsApp messages not sending to admins
- Check environment variables are set correctly
- Verify WhatsApp provider credentials
- Ensure admin accounts have phone numbers in the database
- Check console logs for error messages
- In development, messages are logged to console if no provider is configured
- Codes are always visible in admin dashboard even if WhatsApp fails

### Codes not working
- Codes expire after 15 minutes
- Each code can only be used once
- Check that the email matches the account

### Admin can't see requests
- Ensure user has admin role
- Check that requests haven't expired (15 minutes)
- Verify API endpoint is accessible

## Notes
- **Codes are sent to admin WhatsApp numbers**, not directly to users
- Admins must manually send codes to users via WhatsApp
- Phone numbers are automatically formatted (removes spaces, adds country code)
- South African numbers default to +27 if no country code provided
- The system gracefully handles WhatsApp service failures (codes still visible in dashboard)
- All password reset attempts are logged for security monitoring
- Admin dashboard shows codes with a copy button for easy sharing
- If no admin phones are configured, codes are logged to console and visible in dashboard