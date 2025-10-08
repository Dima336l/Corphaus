# Corphaus - B2B Property Rental Platform

Corphaus is a two-sided property listing and search platform designed to connect landlords with businesses looking for commercial properties suitable for care homes, rent-to-rent, emergency housing, corporate lets, and more.

## 🚀 Features

### For Landlords
- Post property listings with detailed specifications
- Browse business wanted ads
- Manage listings from a dedicated dashboard
- View matching businesses looking for properties
- Upgrade to Pro for unlimited listings

### For Businesses
- Post wanted ads with property requirements
- Search and filter available properties
- Manage wanted ads from a dedicated dashboard
- View matching properties
- Upgrade to Pro for unlimited wanted ads

### Freemium Model
- **Free Users**: Can browse, post 1 listing/ad, view summaries
- **Pro Users (£19/month)**: Unlimited listings, full contact access, verified badge, messaging

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **LocalStorage** - Mock data persistence (for demo purposes)

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── PropertyCard.jsx
│   ├── WantedAdCard.jsx
│   ├── ProtectedRoute.jsx
│   └── PaidFeatureGate.jsx
├── contexts/         # React contexts
│   └── AuthContext.jsx
├── layouts/          # Layout components
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── MainLayout.jsx
├── pages/            # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── PropertiesPage.jsx
│   ├── WantedAdsPage.jsx
│   ├── PropertyDetailPage.jsx
│   ├── WantedAdDetailPage.jsx
│   ├── AddPropertyPage.jsx
│   ├── AddWantedAdPage.jsx
│   ├── LandlordDashboard.jsx
│   ├── BusinessDashboard.jsx
│   ├── PricingPage.jsx
│   └── ContactPage.jsx
├── data/             # Static data and options
│   └── formOptions.js
├── App.jsx           # Main app component with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 🎨 Key Features Implemented

### Authentication System
- Role-based authentication (Landlord/Business)
- Protected routes based on user role
- Session persistence using localStorage

### Property Listings
Complete property listing forms including:
- Property type, bedrooms, bathrooms, facilities
- Use class (C2, C3, C4, Sui Generis)
- Business models accepted (multi-select)
- EPC rating, HMO licence details
- Alterations allowed, accessibility features
- Address and postcode
- Photos and floor plan uploads (UI ready)

### Wanted Ads
Business requirement forms including:
- Business type and company information
- Property requirements (min bedrooms, facilities)
- Preferred location and postcodes
- Budget and lease length
- Special requirements (wheelchair access, etc.)

### Search & Filter
- Advanced filtering by location, property type, bedrooms
- Business model filtering
- Feature filters (parking, accessibility, furnished)
- Grid/List view toggle
- Real-time search results

### Dashboard
- **Landlord Dashboard**: Manage properties, view matching businesses
- **Business Dashboard**: Manage wanted ads, view matching properties
- Statistics cards showing active listings and matches
- Quick actions for adding new listings

### Freemium Features
- Upgrade prompts for free users
- Paid feature gates (blurred content with upgrade CTA)
- Pricing page with plan comparison
- Mock payment integration (ready for Stripe)

### User Experience
- Fully responsive design (mobile, tablet, desktop)
- Modern, clean UI with Tailwind CSS
- Smooth transitions and hover effects
- Loading states and error handling
- Empty state designs

## 🔐 Demo Accounts

Since this is a demo using localStorage, you can:
1. Sign up as a Landlord or Business
2. Create listings/wanted ads
3. Browse and search
4. Test the upgrade flow (mock payment)

## 🚧 Production Considerations

For a production deployment, you would need to:

1. **Backend Integration**
   - Replace localStorage with a proper database (PostgreSQL, MongoDB)
   - Implement RESTful API or GraphQL
   - Add authentication with JWT tokens or sessions
   - Implement password hashing (bcrypt)

2. **Payment Integration**
   - Integrate Stripe for real payments
   - Implement subscription management
   - Add webhook handlers for payment events

3. **File Uploads**
   - Integrate cloud storage (AWS S3, Cloudinary)
   - Image optimization and resizing
   - File type validation and security

4. **Messaging System**
   - Real-time messaging (Socket.io, Pusher)
   - Email notifications
   - Message threading and history

5. **Search & Matching**
   - Implement Elasticsearch for better search
   - Smart matching algorithms
   - Geolocation-based search

6. **Security**
   - HTTPS/SSL certificates
   - CORS configuration
   - Rate limiting
   - Input validation and sanitization
   - CSRF protection

7. **Admin Panel**
   - User management
   - Content moderation
   - Analytics and reporting
   - Payment management

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Next Steps

To continue development:
1. Set up backend API (Node.js/Express, Python/Django, etc.)
2. Integrate real database
3. Add Stripe payment integration
4. Implement file upload functionality
5. Add messaging system
6. Create admin panel
7. Add email notifications
8. Implement SEO optimizations
9. Add analytics tracking
10. Write tests (Jest, React Testing Library)

## 📄 License

This is a demonstration project created for Corphaus.

## 🤝 Support

For questions or support, contact us at info@corphaus.com or visit our contact page.

---

Built with ❤️ using React + Vite + TailwindCSS
