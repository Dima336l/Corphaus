# Revolut Business Merchant Services Integration

This document explains how to set up and use Revolut Business Merchant Services for payment processing in the Corphaus platform.

## Prerequisites

**⚠️ IMPORTANT: You need a Merchant Account, not just a Business Account!**

1. **Revolut Business Account**: You need an active Revolut Business account (this is the base account)
2. **Merchant Account**: You MUST register for a **Merchant Account** within your Revolut Business dashboard
   - A Merchant Account is different from a basic Business account
   - Merchant Account gives you access to the Merchant API (for accepting payments)
   - Webhooks are only available with Merchant Account access
   - **How to get one**: Apply for Merchant Account through your existing Revolut Business dashboard (usually under "Payments" or "Accept Payments" section)
3. **API Keys**: Generate API keys from the Developer section (available after Merchant Account is approved)

## Setup Instructions

### 1. Ensure You Have Merchant Account Access

**First, verify you have Merchant Account access:**

1. Log in to your Revolut Business dashboard
2. Look for sections like:
   - "Accept Payments" or "Merchant" or "Payments"
   - "Developer Portal" or "API" section
3. If you don't see Merchant/API options, you need to:
   - Apply for Merchant Account through your Business dashboard
   - Contact Revolut support to enable Merchant Account features
   - Wait for approval (usually quick, but may require verification)

### 2. Get Your API Keys

**Once you have Merchant Account access:**

1. Log in to your Revolut Business dashboard
2. Navigate to **Developer Portal** or **Settings** → **Developers** → **API keys**
   - Direct link: https://business.revolut.com/developer-portal
3. Generate a new **Secret API Key** (for Merchant API)
4. Copy the API key (you'll only see it once - save it securely!)

### 3. Configure Environment Variables

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

### 4. Create Webhook via API (Optional but Recommended)

**⚠️ Note: Webhooks are only available if you have Merchant Account access!**

**Webhooks are created via API calls, not through a GUI.**

#### Step 1: Create the Webhook

Use a POST request to create a webhook endpoint:

**Using curl:**
```bash
curl -X POST https://merchant.revolut.com/api/1.0/webhooks \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://corphaus-backend.onrender.com/api/payments/webhook",
    "events": [
      "ORDER_COMPLETED",
      "ORDER_AUTHORISED",
      "ORDER_FAILED",
      "ORDER_CANCELLED"
    ]
  }'
```

**Using Node.js/JavaScript:**
```javascript
const response = await fetch('https://merchant.revolut.com/api/1.0/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://corphaus-backend.onrender.com/api/payments/webhook',
    events: [
      'ORDER_COMPLETED',
      'ORDER_AUTHORISED',
      'ORDER_FAILED',
      'ORDER_CANCELLED'
    ]
  })
});

const webhook = await response.json();
console.log('Webhook created:', webhook);
```

**Response will include:**
```json
{
  "id": "webhook_id_here",
  "url": "https://corphaus-backend.onrender.com/api/payments/webhook",
  "events": ["ORDER_COMPLETED", "ORDER_AUTHORISED", "ORDER_FAILED", "ORDER_CANCELLED"],
  "signing_secret": "whsec_..."
}
```

**⚠️ Important:** Save the `signing_secret` from the response! You'll need it to verify webhook signatures.

#### Step 2: Update Your Environment Variables

Add the webhook signing secret to your `.env` file:
```env
REVOLUT_WEBHOOK_SECRET=whsec_...
```

#### Step 3: List Your Webhooks (Optional)

To see all configured webhooks:
```bash
curl -X GET https://merchant.revolut.com/api/1.0/webhooks \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY"
```

#### Step 4: Local Development Setup

For local development, use [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 5000
```

Then create a webhook with the ngrok URL:
```bash
curl -X POST https://merchant.revolut.com/api/1.0/webhooks \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-ngrok-url.ngrok.io/api/payments/webhook",
    "events": ["ORDER_COMPLETED", "ORDER_AUTHORISED"]
  }'
```

**Note:** Remember to update the webhook URL when deploying to production!

#### Step 5: Managing Webhooks (Update/Delete)

**Update a webhook:**
```bash
curl -X PUT https://merchant.revolut.com/api/1.0/webhooks/WEBHOOK_ID \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-new-url.com/api/payments/webhook",
    "events": ["ORDER_COMPLETED", "ORDER_AUTHORISED"]
  }'
```

**Delete a webhook:**
```bash
curl -X DELETE https://merchant.revolut.com/api/1.0/webhooks/WEBHOOK_ID \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY"
```

**Get a specific webhook:**
```bash
curl -X GET https://merchant.revolut.com/api/1.0/webhooks/WEBHOOK_ID \
  -H "Authorization: Bearer YOUR_REVOLUT_API_KEY"
```

**⚠️ Troubleshooting:**

1. **"Unauthorized" error**: Check that your API key is valid and you have Merchant Account access
2. **"Invalid URL" error**: Ensure your webhook URL is publicly accessible (use ngrok for local testing)
3. **No webhook secret returned**: Some accounts may not return signing secrets - webhooks will still work, but signature verification may not be available
4. **Use Polling Instead**: If you can't create webhooks, the app already has a polling fallback mechanism that checks payment status every second for up to 30 seconds (see `PricingPage.jsx`). While not as efficient as webhooks, it will still work!

### 5. Verify Webhook Signature (Recommended for Production)

In production, you should verify webhook signatures to ensure requests are coming from Revolut. Update the `handleWebhook` function in `backend/controllers/paymentController.js` to verify signatures using the `signing_secret` that was returned when you created the webhook via API (see Step 1 above).

The `REVOLUT_WEBHOOK_SECRET` environment variable should contain this signing secret (format: `whsec_...`).

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

1. **Sign up for Sandbox Merchant Account:**
   - Go to: https://sandbox-business.revolut.com/signup
   - Create a free sandbox business account
   - **Apply for Merchant Account access** in the sandbox (same process as production)
   - This is completely separate from production

2. **Get Sandbox API Keys:**
   - Log into sandbox dashboard: https://sandbox-business.revolut.com
   - Navigate to **Developer Portal** or **Settings** → **Developers** → **API keys**
   - Generate a sandbox Merchant API key (only available after Merchant Account is set up)

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
- Create webhook via API (see "Create Webhook via API" section above)
- Test different webhook events by completing test payments

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
- List your webhooks via API to verify it was created: `GET /api/1.0/webhooks`
- Check that webhook events are correctly configured (`ORDER_COMPLETED`, etc.)
- Verify webhook URL matches your backend endpoint exactly
- Check server logs for incoming requests
- Test with a payment in sandbox to trigger webhook events

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

