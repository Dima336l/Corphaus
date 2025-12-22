# Revolut Business Merchant Services Integration

This document explains how to set up and use Revolut Business Merchant Services for payment processing in the Corphaus platform.

## Prerequisites

1. **Revolut Business Account**: You need an active Revolut Business account
2. **Merchant Account**: Register for a Merchant Account within your Revolut Business dashboard
3. **API Keys**: Generate API keys from the Developer section in your Revolut Business dashboard

## Setup Instructions

### 1. Get Your API Keys

1. Log in to your Revolut Business dashboard
2. Navigate to **Settings** → **Developers** → **API keys**
3. Generate a new **Secret API Key**
4. Copy the API key (you'll only see it once)

### 2. Configure Environment Variables

**For Testing (Recommended First):**

Add the following to your `.env` file in the `backend` directory:

```env
# Revolut Business Merchant Services - SANDBOX (No Real Money!)
REVOLUT_API_KEY=your_sandbox_api_key_here
REVOLUT_API_URL=https://sandbox-merchant.revolut.com/api/1.0
```

**For Production (After Testing):**

```env
# Revolut Business Merchant Services - PRODUCTION (Real Money!)
REVOLUT_API_KEY=your_production_api_key_here
REVOLUT_API_URL=https://merchant.revolut.com/api/1.0
```

**Important:** 
- Start with sandbox to test without any risk
- Sandbox uses test cards that don't charge real money
- Production keys are different and will charge real money
- Never commit API keys to version control!

### 3. Configure Webhook Endpoint

In your Revolut Business dashboard:
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select the following events to listen for:
   - `ORDER_COMPLETED`
   - `ORDER_AUTHORISED`
   - `ORDER_FAILED`
   - `ORDER_CANCELLED`

**Note**: For local development, you can use a service like [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 5000
```
Then use the ngrok URL for webhook configuration.

### 4. Verify Webhook Signature (Recommended for Production)

In production, you should verify webhook signatures to ensure requests are coming from Revolut. Update the `handleWebhook` function in `backend/controllers/paymentController.js` to verify signatures using the webhook secret from your Revolut dashboard.

## How It Works

### Payment Flow

1. **User Clicks "Upgrade to Pro"**
   - Frontend calls `/api/payments/create-order`
   - Backend creates a payment order in Revolut
   - Returns checkout URL or order details

2. **User Completes Payment**
   - User is redirected to Revolut checkout page
   - User enters payment details and completes payment

3. **Payment Confirmation**
   - Revolut sends webhook to `/api/payments/webhook`
   - Backend updates user subscription status
   - User is redirected back to the application

### API Endpoints

#### `POST /api/payments/create-order`
Creates a new payment order for subscription upgrade.

**Authentication**: Required (x-user-id header)

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "public_id": "public_order_id",
    "checkout_url": "https://pay.revolut.com/checkout/...",
    "amount": 1900,
    "currency": "GBP",
    "state": "PENDING"
  }
}
```

#### `POST /api/payments/webhook`
Receives webhook events from Revolut.

**Authentication**: None (but should verify signature)

**Events Handled**:
- `ORDER_COMPLETED`: Payment successful, activate subscription
- `ORDER_AUTHORISED`: Payment authorized, activate subscription
- `ORDER_FAILED`: Payment failed, clear order ID
- `ORDER_CANCELLED`: Payment cancelled, clear order ID

#### `GET /api/payments/status/:orderId`
Check the status of a payment order.

**Authentication**: Required (x-user-id header)

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "state": "COMPLETED",
    "amount": 1900,
    "currency": "GBP"
  },
  "user": {
    "isPaid": true,
    "subscriptionPlan": "pro",
    "subscriptionEndDate": "2024-02-15T00:00:00.000Z"
  }
}
```

## Subscription Details

- **Pro Plan Price**: £19/month
- **Currency**: GBP
- **Billing Period**: 30 days
- **Amount**: 1900 pence (£19.00)

## Testing

### Sandbox Environment - No Real Money!

**YES, you can test completely without sending real money!** The Revolut sandbox environment is designed exactly for this purpose.

**Key Points:**
- ✅ **No real transactions** - All payments are simulated
- ✅ **No money is charged** - Test cards don't actually charge anything
- ✅ **Full functionality** - Test the complete payment flow
- ✅ **Safe testing** - Try different scenarios without risk

### Setup for Testing

1. **Sign up for Sandbox Account:**
   - Go to: https://sandbox-business.revolut.com/signup
   - Create a free sandbox business account
   - This is completely separate from production

2. **Get Sandbox API Keys:**
   - Log into sandbox dashboard: https://sandbox-business.revolut.com
   - Navigate to **Settings** → **Developers** → **API keys**
   - Generate a sandbox API key

3. **Configure Environment for Testing:**
   ```env
   REVOLUT_API_KEY=your_sandbox_api_key_here
   REVOLUT_API_URL=https://sandbox-merchant.revolut.com/api/1.0
   ```

4. **Use Test Cards:**
   - Revolut provides test card numbers in their sandbox documentation
   - These cards don't charge real money
   - You can test various scenarios:
     - ✅ Successful payment
     - ❌ Failed payment (declined card)
     - 🔒 3D Secure authentication
     - 💳 Different card types (Visa, Mastercard, etc.)

### Test Scenarios

**Successful Payment:**
- Use a valid test card number (check Revolut sandbox docs)
- Complete the payment flow
- Verify webhook is received
- Check that subscription is activated in database

**Failed Payment:**
- Use an invalid/declined test card
- Verify error handling
- Check that user can retry

**Webhook Testing:**
- Use a tool like ngrok for local webhook testing: `ngrok http 5000`
- Configure webhook URL in sandbox dashboard
- Test different webhook events

### Moving to Production

**When you're ready to go live:**
1. Sign up for a real Revolut Business account: https://business.revolut.com
2. Get production API keys (different from sandbox)
3. Update `.env` to use production API URL:
   ```env
   REVOLUT_API_URL=https://merchant.revolut.com/api/1.0
   ```
4. Update webhook URL to your production domain
5. Test with a small real transaction first

**Remember:** Only real money is charged in production, never in sandbox!

## Troubleshooting

### Payment Order Creation Fails

- Check that `REVOLUT_API_KEY` is set correctly
- Verify API key has correct permissions
- Check API URL is correct (sandbox vs production)

### Webhook Not Received

- Verify webhook URL is accessible (use ngrok for local testing)
- Check webhook configuration in Revolut dashboard
- Ensure webhook events are enabled
- Check server logs for incoming requests

### Payment Completed but Subscription Not Activated

- Check webhook handler logs
- Verify user lookup by order ID
- Check database for order ID association
- Manually check payment status using status endpoint

## Security Considerations

1. **API Key Security**: Never commit API keys to version control
2. **Webhook Verification**: Always verify webhook signatures in production
3. **HTTPS**: Use HTTPS in production for webhook endpoints
4. **Rate Limiting**: Implement rate limiting on payment endpoints
5. **Error Handling**: Don't expose sensitive error details to clients

## Support

- Revolut Developer Documentation: https://developer.revolut.com/docs/merchant/merchant-api
- Revolut Business Support: Available through your Revolut Business dashboard

