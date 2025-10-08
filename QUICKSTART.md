# Corphaus - Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### 1. Start the Development Server

The server should already be running. If not:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### 2. Explore the Platform

The app comes pre-loaded with demo data so you can see properties and wanted ads immediately!

#### As a Visitor (Not Logged In):
- ✅ Browse properties at `/properties`
- ✅ Browse wanted ads at `/wanted-ads`
- ✅ View pricing at `/pricing`
- ✅ Contact page at `/contact`

#### Create an Account:
1. Click "Sign Up" in the header
2. Choose **Landlord** or **Business**
3. Fill in your details (any email/password works - this is a demo!)
4. You'll be redirected to your dashboard

### 3. Test Features by Role

#### As a Landlord:
- **Dashboard**: `/landlord/dashboard`
  - View your active listings
  - See matching businesses
  - Quick stats overview
- **List Property**: Click "List New Property" button
  - Fill in comprehensive property details
  - Select accepted business models
  - Add description and requirements
- **Free Limit**: Try creating 2 properties - you'll be prompted to upgrade!

#### As a Business:
- **Dashboard**: `/business/dashboard`
  - View your wanted ads
  - See matching properties
  - Account status
- **Post Wanted Ad**: Click "Post New Wanted Ad" button
  - Describe your property requirements
  - Set your budget and preferences
  - Specify must-have features
- **Free Limit**: Try creating 2 wanted ads - you'll be prompted to upgrade!

### 4. Test Freemium Features

#### Free User (Default):
- Post 1 listing/wanted ad
- Browse all content
- Contact details are **blurred** with upgrade prompt

#### Upgrade to Pro:
1. Go to `/pricing`
2. Click "Upgrade to Pro"
3. Confirm the mock upgrade (no real payment)
4. Now you can:
   - Post unlimited listings
   - View full contact details
   - Get a "Pro" badge
   - See unblurred contact info on detail pages

### 5. Test Key Pages

| Page | URL | What to Test |
|------|-----|--------------|
| Home | `/` | Hero section, features, CTAs |
| Properties | `/properties` | Search, filters, grid/list view |
| Property Detail | `/properties/{id}` | Click any property card |
| Wanted Ads | `/wanted-ads` | Browse business requirements |
| Ad Detail | `/wanted-ads/{id}` | Click any wanted ad card |
| Pricing | `/pricing` | Plan comparison, upgrade |
| Contact | `/contact` | Contact form |

## 🎯 Demo Features to Showcase

### 1. **Authentication Flow**
- Sign up as Landlord → See landlord-specific UI
- Sign up as Business → See business-specific UI
- Role-based navigation (different dashboards)

### 2. **Comprehensive Forms**
The property listing form includes ALL required fields from your brief:
- Property type, bedrooms, en-suites, studio rooms
- Kitchens, reception rooms
- Outdoor space, parking
- Full address and postcode
- Use class (C2, C3, C4, Sui Generis)
- Alterations allowed
- Business models (multi-select)
- EPC rating
- Furnished, wheelchair accessible
- HMO licence details
- Rent and lease length

### 3. **Advanced Search & Filtering**
- Location search
- Property type filter
- Bedroom count
- Business model matching
- Feature filters (parking, accessibility, furnished)
- Real-time filtering

### 4. **Freemium Model**
- Free: 1 listing, blurred contacts
- Pro: Unlimited, full access
- Upgrade prompts strategically placed
- Beautiful pricing page

### 5. **Matching System**
- Landlord dashboard shows businesses matching their property types
- Business dashboard shows properties matching their requirements

### 6. **Responsive Design**
- Mobile-friendly header with hamburger menu
- Responsive grids
- Touch-friendly cards and buttons

## 🔧 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Changes Not Showing
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear

### Mock Data Reset
To reset all data to demo state:
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

## 📱 Test Scenarios

### Scenario 1: Landlord Journey
1. Sign up as landlord
2. List a care home property
3. Browse wanted ads
4. See matching businesses in dashboard
5. Try to view contact (blocked - free user)
6. Upgrade to Pro
7. Now see full contact details

### Scenario 2: Business Journey
1. Sign up as business (e.g., "ABC Care Homes")
2. Post wanted ad for care home property
3. Browse properties
4. Filter by business model "Care Home"
5. Click property detail
6. Contact blocked → upgrade
7. After upgrade, view full contact info

### Scenario 3: Guest Journey
1. Browse properties without logging in
2. Try to view property details (works!)
3. Try to list property (redirected to login)
4. Sign up required for posting

## 🎨 Design Highlights

- **Primary Color**: Blue (customizable in tailwind.config.js)
- **Modern UI**: Clean cards, smooth transitions
- **Professional**: Business-focused design
- **Accessible**: Good contrast, keyboard navigation
- **Icons**: Lucide React (consistent, beautiful)

## 📊 Mock Data

The app includes 3 sample properties and 3 sample wanted ads on first load:
- Properties: Care home, HMO, Corporate block
- Wanted ads: Care provider, Rent-to-rent operator, Corporate housing

## 🚢 Production Checklist

Before going live, implement:
- [ ] Backend API (Node.js/Python/Ruby)
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Stripe integration for payments
- [ ] File upload (AWS S3/Cloudinary)
- [ ] Email notifications
- [ ] Real authentication (JWT/sessions)
- [ ] Messaging system
- [ ] Admin panel
- [ ] SEO optimization
- [ ] Analytics tracking

## 💡 Tips

1. **Data Persistence**: Uses localStorage - data survives page refreshes
2. **No Backend**: Fully functional frontend demo
3. **Mock Payments**: Upgrade flow shows UI, no real charges
4. **Extensible**: Clean code structure, easy to add features
5. **Production-Ready UI**: Just needs backend integration

---

Enjoy exploring Corphaus! 🏠✨

