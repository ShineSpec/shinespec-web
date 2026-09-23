# Payment Integration Setup Guide

## Overview
The application now supports multiple payment methods:
- **Paystack** - For card payments, bank transfers, and other payment methods
- **SnapScan** - QR code-based mobile payments
- **EFT** - Bank transfer (manual confirmation)

## Backend Setup

### 1. Environment Variables
Add these to your `.env` file:

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# SnapScan Configuration
SNAPSCAN_MERCHANT_ID=your_snapscan_merchant_id
SNAPSCAN_API_KEY=your_snapscan_api_key

# Application URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### 2. Paystack Setup
1. Sign up at https://paystack.com/
2. Get your API keys from the dashboard
3. Add test keys for development, production keys for production
4. Configure webhook URL: `https://yourdomain.com/api/payments/paystack/webhook`

### 3. SnapScan Setup
1. Sign up at https://www.snapscan.co.za/
2. Get your Merchant ID and API Key
3. Configure callback URL: `https://yourdomain.com/api/payments/snapscan/callback`

## Payment Flow

### 1. Booking Creation
- User fills booking details and selects payment method
- Booking is created with `payment.status = 'pending'`
- Booking ID is stored for payment processing

### 2. Payment Initialization

#### Paystack Flow:
1. Frontend calls `/api/payments/paystack/initialize` with booking ID and amount
2. Backend creates Paystack transaction
3. User is redirected to Paystack payment page
4. After payment, user is redirected back with reference
5. Frontend verifies payment via `/api/payments/paystack/verify`
6. Webhook also verifies payment for reliability

#### SnapScan Flow:
1. Frontend calls `/api/payments/snapscan/initialize` with booking ID and amount
2. Backend generates QR code and payment URL
3. QR code is displayed to user
4. User scans QR code with SnapScan app
5. Payment is processed
6. User can check status via `/api/payments/snapscan/verify`

### 3. Payment Verification
- Payment status is verified via API endpoints
- Booking status is updated to `confirmed`
- Payment status is updated to `paid`
- Worker is notified if assigned

### 4. Worker Notification
After successful payment:
- Worker receives notification (SMS/Email/Push)
- Booking is assigned to worker
- Worker can see booking in their dashboard

## API Endpoints

### Paystack
- `POST /api/payments/paystack/initialize` - Initialize payment
- `GET /api/payments/paystack/verify?reference=xxx` - Verify payment
- `POST /api/payments/paystack/webhook` - Webhook handler

### SnapScan
- `POST /api/payments/snapscan/initialize` - Initialize payment
- `GET /api/payments/snapscan/callback` - Payment callback
- `GET /api/payments/snapscan/verify?reference=xxx` - Verify payment

## Frontend Integration

### Payment Method Selection
Users can select from:
- Credit Card / Debit Card (Paystack)
- Paystack (Card, Bank Transfer, etc.)
- SnapScan
- EFT (Bank Transfer)

### Payment Processing
1. User clicks "Confirm & Pay"
2. Booking is created first
3. Payment gateway is initialized based on selected method
4. User completes payment
5. Payment is verified
6. User is redirected to success page

## Testing

### Paystack Test Cards
- Success: `4084084084084081`
- Decline: `5060666666666666666`
- 3D Secure: `5060666666666666669`

### SnapScan Testing
- Use SnapScan test mode
- Scan QR code with SnapScan app
- Complete test payment

## Security Considerations

1. **Webhook Verification**: Paystack webhooks are verified using HMAC signature
2. **Payment Verification**: Always verify payments server-side
3. **HTTPS**: Use HTTPS in production
4. **API Keys**: Never expose secret keys in frontend
5. **Transaction References**: Use unique references for each transaction

## Error Handling

- Payment failures are logged
- Users are notified of payment errors
- Bookings remain in `pending` status until payment succeeds
- Failed payments can be retried

## Worker Notification

After successful payment, workers are notified via:
- SMS (if configured)
- Email (if configured)
- Push notification (if configured)
- In-app notification

The notification includes:
- Booking details
- Service type
- Scheduled date and time
- Customer address
- Payment confirmation

## Production Checklist

- [ ] Replace test API keys with production keys
- [ ] Configure webhook URLs
- [ ] Set up HTTPS
- [ ] Test all payment methods
- [ ] Configure worker notification system
- [ ] Set up payment monitoring
- [ ] Configure error alerts
- [ ] Test payment retry flow

