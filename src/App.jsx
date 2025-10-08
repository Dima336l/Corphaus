import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { WantedAdsPage } from './pages/WantedAdsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { WantedAdDetailPage } from './pages/WantedAdDetailPage';
import { AddPropertyPage } from './pages/AddPropertyPage';
import { AddWantedAdPage } from './pages/AddWantedAdPage';
import { LandlordDashboard } from './pages/LandlordDashboard';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes with layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/wanted-ads" element={<WantedAdsPage />} />
            <Route path="/wanted-ads/:id" element={<WantedAdDetailPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Landlord Routes */}
            <Route
              path="/landlord/dashboard"
              element={
                <ProtectedRoute requireRole="landlord">
                  <LandlordDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord/add-property"
              element={
                <ProtectedRoute requireRole="landlord">
                  <AddPropertyPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Business Routes */}
            <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute requireRole="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/add-wanted-ad"
              element={
                <ProtectedRoute requireRole="business">
                  <AddWantedAdPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth routes without main layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
