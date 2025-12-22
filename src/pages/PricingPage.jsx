import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../utils/api';
import { Check, X, Loader2 } from 'lucide-react';

export const PricingPage = () => {
  const { user, isPaid, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    if (isPaid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment order with Revolut
      const response = await paymentsAPI.createOrder(user.id || user._id);
      
      if (response.success && response.order) {
        // If there's a checkout URL, redirect to it
        if (response.order.checkout_url) {
          window.location.href = response.order.checkout_url;
          return;
        }

        // If no checkout URL, poll for payment status
        // (This might happen if using Revolut's payment API differently)
        const orderId = response.order.id;
        const maxAttempts = 30; // 30 attempts = ~30 seconds
        let attempts = 0;

        const checkPaymentStatus = async () => {
          try {
            const statusResponse = await paymentsAPI.checkStatus(orderId, user.id || user._id);
            
            if (statusResponse.success && statusResponse.user?.isPaid) {
              // Payment successful
              window.location.reload(); // Reload to update auth state
              return;
            }

            attempts++;
            if (attempts < maxAttempts && (statusResponse.order?.state === 'PENDING' || statusResponse.order?.state === 'PROCESSING')) {
              setTimeout(checkPaymentStatus, 1000); // Check again in 1 second
            } else {
              setError('Payment is taking longer than expected. Please check your account or try again.');
              setLoading(false);
            }
          } catch (statusError) {
            console.error('Error checking payment status:', statusError);
            setError('Error checking payment status. Please refresh the page to see if your payment was processed.');
            setLoading(false);
          }
        };

        // Start polling
        setTimeout(checkPaymentStatus, 2000); // Wait 2 seconds before first check
      } else {
        throw new Error(response.message || 'Failed to create payment order');
      }
    } catch (err) {
      console.error('Error creating payment order:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Get started with basic features',
      features: [
        { text: 'Browse all listings', included: true },
        { text: '1 property listing or wanted ad', included: true },
        { text: 'View listing summaries', included: true },
        { text: 'Contact details access', included: false },
        { text: 'Messaging system', included: false },
        { text: 'Unlimited listings', included: false },
        { text: 'Verified badge', included: false },
        { text: 'Priority support', included: false },
      ],
      buttonText: 'Current Plan',
      buttonDisabled: true,
    },
    {
      name: 'Pro',
      price: '19',
      period: 'per month',
      description: 'Everything you need to succeed',
      popular: true,
      features: [
        { text: 'Browse all listings', included: true },
        { text: 'Unlimited property listings or wanted ads', included: true },
        { text: 'View full contact details', included: true },
        { text: 'Messaging system', included: true },
        { text: 'Send/respond to messages', included: true },
        { text: 'Verified badge', included: true },
        { text: 'Priority support', included: true },
        { text: 'Analytics dashboard', included: true },
      ],
      buttonText: isPaid ? 'Current Plan' : 'Upgrade to Pro',
      buttonDisabled: isPaid,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you. Upgrade anytime to unlock unlimited listings and contact access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary-600 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">£{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={plan.buttonDisabled || loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-8 flex items-center justify-center ${
                    plan.buttonDisabled || loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </button>
                {error && plan.name === 'Pro' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. Your Pro features will remain active until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit and debit cards including Visa, Mastercard, and American Express through Revolut Business Merchant Services. All payments are processed securely and encrypted.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade from Free to Pro?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade to Pro at any time. Your existing listings will remain active and you'll immediately get access to all Pro features.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee. If you're not satisfied with Pro for any reason, contact us within 14 days for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
            Contact our support team →
          </Link>
        </div>
      </div>
    </div>
  );
};

