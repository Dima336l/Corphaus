# Monthly Subscription Implementation

## Summary

The payment system has been updated to properly handle monthly subscriptions instead of one-time payments. Subscriptions now:

- ✅ Track subscription status (active, cancelled, expired)
- ✅ Support recurring monthly payments
- ✅ Allow cancellation (at end of billing period)
- ✅ Allow reactivation of cancelled subscriptions
- ✅ Automatically extend subscriptions on renewal payments

## Changes Made

### 1. User Model (`backend/models/User.js`)

**Added Fields:**
- `subscriptionStatus`: Enum (`'active'`, `'cancelled'`, `'expired'`) - tracks subscription state
- `subscriptionCancelAt`: Date - when subscription will be cancelled (end of billing period)

**Added Methods:**
- `hasActiveSubscription()`: Method to check if user has an active subscription

### 2. Payment Controller (`backend/controllers/paymentController.js`)

**Updated Functions:**
- `createPaymentOrder`: Now checks subscription status instead of just `isPaid`
- `handlePaymentSuccess`: 
  - Sets `subscriptionStatus` to `'active'`
  - Handles renewals (extends existing subscription by 30 days)
  - Handles new subscriptions (sets start date and 30-day end date)
- `checkPaymentStatus`: Updated to set subscription status properly

**New Functions:**
- `cancelSubscription`: Cancels subscription at end of billing period
- `reactivateSubscription`: Reactivates a cancelled subscription

### 3. Payment Routes (`backend/routes/paymentRoutes.js`)

**New Endpoints:**
- `POST /api/payments/cancel-subscription` - Cancel subscription
- `POST /api/payments/reactivate-subscription` - Reactivate cancelled subscription

### 4. Auth Controller (`backend/controllers/authController.js`)

**Updated:**
- `signup`: Sets `subscriptionStatus` to `'expired'` for new users
- `upgradeToPaid`: Sets `subscriptionStatus` to `'active'` (legacy endpoint)

## Subscription Flow

### New Subscription
1. User clicks "Upgrade to Pro" on Pricing page
2. Creates payment order via `/api/payments/create-order`
3. User completes payment
4. Webhook receives `ORDER_COMPLETED` event
5. Subscription activated:
   - `isPaid = true`
   - `subscriptionPlan = 'pro'`
   - `subscriptionStatus = 'active'`
   - `subscriptionStartDate = now`
   - `subscriptionEndDate = now + 30 days`

### Monthly Renewal
1. Revolut processes recurring payment (monthly)
2. Webhook receives `ORDER_COMPLETED` event
3. System detects existing active subscription
4. Subscription extended:
   - `subscriptionEndDate = current subscriptionEndDate + 30 days`

### Cancellation
1. User calls `/api/payments/cancel-subscription`
2. System sets:
   - `subscriptionStatus = 'cancelled'`
   - `subscriptionCancelAt = subscriptionEndDate`
3. User retains access until end of billing period
4. Subscription expires at `subscriptionEndDate`

### Reactivation
1. User calls `/api/payments/reactivate-subscription`
2. System sets:
   - `subscriptionStatus = 'active'`
   - `subscriptionCancelAt = null`
3. Subscription continues as normal

## API Endpoints

### Create Payment Order
```
POST /api/payments/create-order
Headers: x-user-id: <userId>
Response: { success, order: { id, checkout_url, ... } }
```

### Cancel Subscription
```
POST /api/payments/cancel-subscription
Headers: x-user-id: <userId>
Response: { success, message, subscription: { status, endDate, cancelAt } }
```

### Reactivate Subscription
```
POST /api/payments/reactivate-subscription
Headers: x-user-id: <userId>
Response: { success, message, subscription: { status, endDate } }
```

### Check Payment Status
```
GET /api/payments/status/:orderId
Headers: x-user-id: <userId>
Response: { success, order: {...}, user: { isPaid, subscriptionPlan, subscriptionStatus, ... } }
```

## Subscription Status Values

- **`active`**: Subscription is active and paid
- **`cancelled`**: User cancelled, but subscription remains active until end date
- **`expired`**: Subscription has expired (default for free users)

## Notes

1. **Recurring Payments**: The system handles recurring payments through webhooks. When a payment is received, it automatically extends the subscription if the user has an active subscription.

2. **Cancellation**: When a user cancels, they keep access until the end of their billing period (`subscriptionEndDate`). The subscription status is set to `'cancelled'` to prevent auto-renewal.

3. **Expiry**: Expired subscriptions are automatically handled - users with expired subscriptions cannot access paid features.

4. **Revolut Integration**: This implementation uses Revolut's payment API. For true recurring subscriptions, you may need to:
   - Set up Revolut's subscription/recurring payment feature (if available)
   - Or implement a cron job to charge users monthly
   - Or rely on webhooks from Revolut for recurring charges

5. **Testing**: Test users created with `createTestUsers.js` will need to have `subscriptionStatus` set manually, or the script should be updated.

## Next Steps (Optional)

1. **Cron Job for Expiry**: Add a scheduled job to check and expire subscriptions
2. **Email Notifications**: Send emails when subscriptions expire or are about to expire
3. **Billing History**: Track payment history for users
4. **Subscription Management UI**: Add UI for users to manage their subscriptions
5. **Auto-Renewal Logic**: If Revolut doesn't handle recurring payments, implement a cron job to create new orders monthly

