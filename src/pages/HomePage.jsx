import { Link } from 'react-router-dom';
import { Building2, Search, Users, Shield, TrendingUp, CheckCircle } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Landlords with Businesses for Commercial Property Lets
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              The UK's leading platform for B2B property rentals - from care homes to corporate lets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                Get Started Free
              </Link>
              <Link to="/properties" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Corphaus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Building2 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Specialized Platform</h3>
              <p className="text-gray-600">
                Focus on B2B property rentals including care homes, rent-to-rent, emergency housing, and corporate lets.
              </p>
            </div>
            <div className="card text-center">
              <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Matching</h3>
              <p className="text-gray-600">
                Smart filters help landlords and businesses find the perfect match for their needs.
              </p>
            </div>
            <div className="card text-center">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Verified Users</h3>
              <p className="text-gray-600">
                Premium members get verified badges for increased trust and credibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Landlords */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary-900 flex items-center">
                <Building2 className="w-8 h-8 mr-3" />
                For Landlords
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create a free account and list your property</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Specify property details, business models accepted, and requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Browse business wanted ads and find matches</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Upgrade to access full contact details and unlimited listings</span>
                </li>
              </ul>
              <Link to="/signup" className="btn-primary mt-6 inline-block">
                List Your Property
              </Link>
            </div>

            {/* For Businesses */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3" />
                For Businesses
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Register and post your property requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Search available properties suitable for your business model</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Filter by location, use class, accessibility, and more</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Upgrade to contact landlords directly</span>
                </li>
              </ul>
              <Link to="/signup" className="btn-primary mt-6 inline-block">
                Find Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Models Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Supported Business Models
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Rent-to-Rent',
              'Care Home',
              'Assisted Living',
              'Corporate Lets',
              'Emergency Accommodation',
              'Serviced Accommodation',
              'Social Housing',
              'Nursery'
            ].map((model) => (
              <div key={model} className="bg-white rounded-lg p-4 text-center font-semibold text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                {model}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of landlords and businesses already using Corphaus
          </p>
          <Link to="/signup" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Active Properties</div>
            </div>
            <div>
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Registered Users</div>
            </div>
            <div>
              <CheckCircle className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-2">250+</div>
              <div className="text-gray-600">Successful Matches</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

