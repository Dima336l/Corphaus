import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

export const PaidFeatureGate = ({ children, feature = 'this feature' }) => {
  const { isPaid } = useAuth();
  const navigate = useNavigate();

  if (isPaid) {
    return children;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center p-8 max-w-md">
          <Lock className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to Access {feature}
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to a paid plan to unlock full contact details and unlimited listings.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="btn-primary"
          >
            View Pricing Plans
          </button>
        </div>
      </div>
    </div>
  );
};

