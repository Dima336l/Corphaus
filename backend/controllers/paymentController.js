import User from '../models/User.js';

// Revolut API configuration
const REVOLUT_API_URL = process.env.REVOLUT_API_URL || 'https://merchant.revolut.com/api/1.0';
const REVOLUT_API_KEY = process.env.REVOLUT_API_KEY;

/**
 * Helper function to make authenticated requests to Revolut API
 */
const revolutRequest = async (endpoint, options = {}) => {
  if (!REVOLUT_API_KEY) {
    throw new Error('Revolut API key is not configured');
  }

  const url = `${REVOLUT_API_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${REVOLUT_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Revolut API error: ${response.status} - ${errorText}`);
  }

  // Some endpoints return empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
};

// @desc    Create payment order for subscription
// @route   POST /api/payments/create-order
// @access  Private
export const createPaymentOrder = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isPaid && user.subscriptionEndDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'User already has an active subscription'
      });
    }

    // Pro plan price: £19/month
    const amount = 1900; // Amount in minor units (pence), so £19.00 = 1900
    const currency = 'GBP';

    // Create order in Revolut
    const orderData = {
      amount: amount,
      currency: currency,
      description: 'Corphaus Pro Subscription - Monthly',
      customer_id: user.revolutCustomerId || undefined,
      metadata: {
        user_id: user._id.toString(),
        subscription_type: 'pro',
        plan: 'monthly'
      }
    };

    // Create or get customer ID
    if (!user.revolutCustomerId) {
      // Create customer in Revolut (optional, but recommended for recurring payments)
      try {
        const customerData = {
          full_name: user.name,
          email: user.email,
          phone: user.phone || undefined
        };
        const customer = await revolutRequest('/customers', {
          method: 'POST',
          body: JSON.stringify(customerData)
        });
        if (customer && customer.id) {
          user.revolutCustomerId = customer.id;
          await user.save();
          orderData.customer_id = customer.id;
        }
      } catch (customerError) {
        console.warn('Failed to create Revolut customer, proceeding without:', customerError.message);
      }
    }

    // Create order
    const order = await revolutRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    if (!order || !order.id) {
      throw new Error('Failed to create payment order');
    }

    // Store order ID in user record
    user.revolutOrderId = order.id;
    await user.save();

    // Return payment information to frontend
    res.json({
      success: true,
      order: {
        id: order.id,
        public_id: order.public_id,
        amount: order.amount,
        currency: order.currency,
        state: order.state,
        checkout_url: order.checkout_url, // URL to redirect user for payment
        // For card payments, you might also need card details or payment form
      }
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// @desc    Handle Revolut webhook events
// @route   POST /api/payments/webhook
// @access  Public (but should verify webhook signature)
export const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (recommended for production)
    // const signature = req.headers['revolut-signature'];
    // verifyWebhookSignature(signature, req.body);

    console.log('Revolut webhook received:', event.type);

    switch (event.type) {
      case 'ORDER_COMPLETED':
      case 'ORDER_AUTHORISED':
        await handlePaymentSuccess(event);
        break;
      
      case 'ORDER_FAILED':
      case 'ORDER_CANCELLED':
        await handlePaymentFailure(event);
        break;
      
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    // Still return 200 to prevent Revolut from retrying
    res.status(200).json({ received: true, error: error.message });
  }
};

// Handle successful payment
const handlePaymentSuccess = async (event) => {
  try {
    // Revolut webhook structure may vary - adjust based on actual API docs
    // Common formats: event.data.id, event.order.id, event.data.order_id
    const order = event.data || event.order || event;
    const orderId = order.id || order.order_id;

    if (!orderId) {
      console.error('No order ID found in webhook event:', JSON.stringify(event));
      return;
    }

    // Find user by order ID
    const user = await User.findOne({ revolutOrderId: orderId });
    
    if (!user) {
      console.error('User not found for order ID:', orderId);
      // Try to find by metadata if available
      const metadataUserId = order.metadata?.user_id || event.metadata?.user_id;
      if (metadataUserId) {
        const userByMetadata = await User.findById(metadataUserId);
        if (userByMetadata) {
          userByMetadata.revolutOrderId = orderId;
          userByMetadata.isPaid = true;
          userByMetadata.subscriptionPlan = 'pro';
          userByMetadata.subscriptionStartDate = new Date();
          userByMetadata.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          userByMetadata.revolutPaymentId = order.payments?.[0]?.id || orderId;
          await userByMetadata.save();
          console.log(`Subscription activated for user ${userByMetadata._id} (found via metadata)`);
          return;
        }
      }
      return;
    }

    // Update user subscription
    user.isPaid = true;
    user.subscriptionPlan = 'pro';
    user.subscriptionStartDate = new Date();
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    user.revolutPaymentId = order.payments?.[0]?.id || order.payment_id || orderId;
    
    await user.save();

    console.log(`Subscription activated for user ${user._id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

// Handle failed payment
const handlePaymentFailure = async (event) => {
  try {
    // Revolut webhook structure may vary - adjust based on actual API docs
    const order = event.data || event.order || event;
    const orderId = order.id || order.order_id;

    if (!orderId) {
      console.error('No order ID found in webhook event:', JSON.stringify(event));
      return;
    }

    // Find user by order ID
    const user = await User.findOne({ revolutOrderId: orderId });
    
    if (!user) {
      console.error('User not found for order ID:', orderId);
      return;
    }

    // Clear order ID so user can retry
    user.revolutOrderId = null;
    await user.save();

    console.log(`Payment failed for user ${user._id}, order ${orderId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
};

// @desc    Check payment status
// @route   GET /api/payments/status/:orderId
// @access  Private
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.revolutOrderId !== orderId) {
      return res.status(403).json({
        success: false,
        message: 'Order does not belong to this user'
      });
    }

    // Check order status with Revolut
    const order = await revolutRequest(`/orders/${orderId}`);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If order is completed, update user subscription
    if (order.state === 'COMPLETED' || order.state === 'AUTHORISED') {
      if (!user.isPaid || user.subscriptionEndDate < new Date()) {
        user.isPaid = true;
        user.subscriptionPlan = 'pro';
        user.subscriptionStartDate = new Date();
        user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        user.revolutPaymentId = order.payments?.[0]?.id || orderId;
        await user.save();
      }
    }

    res.json({
      success: true,
      order: {
        id: order.id,
        state: order.state,
        amount: order.amount,
        currency: order.currency
      },
      user: {
        isPaid: user.isPaid,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking payment status',
      error: error.message
    });
  }
};

