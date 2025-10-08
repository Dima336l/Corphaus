# Corphaus API Testing Guide

## 🔑 Authentication

For now, the API uses simple header-based authentication (mock):
- `x-user-id`: User ID (any string like "user123")
- `x-user-ispaid`: "true" or "false" (subscription status)

In production, this will be replaced with JWT tokens.

## 📋 API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health
```

### API Information
```bash
GET http://localhost:5000/api
```

---

## 🏠 Properties API

### 1. Get All Properties (Public)
```bash
curl http://localhost:5000/api/properties
```

**With filters:**
```bash
curl "http://localhost:5000/api/properties?propertyType=Detached&minBedrooms=3&hasParking=true"
```

**Query Parameters:**
- `propertyType` - Detached, Semi-Detached, Terraced, Block of Flats
- `businessModel` - Care Home, Rent-to-Rent, Corporate Lets, etc.
- `minBedrooms` - Minimum number of bedrooms
- `postcode` - Search by postcode (partial match)
- `hasParking` - true/false
- `wheelchairAccessible` - true/false
- `furnished` - true/false

### 2. Get Property by ID (Public)
```bash
curl http://localhost:5000/api/properties/PROPERTY_ID
```

### 3. Create Property (Auth Required)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "x-user-id: landlord123" \
  -H "x-user-ispaid: false" \
  -d '{
    "landlordName": "John Smith",
    "landlordEmail": "john@example.com",
    "propertyType": "Detached",
    "bedrooms": 6,
    "enSuites": 4,
    "studioRooms": 0,
    "kitchens": 2,
    "receptionRooms": 3,
    "hasOutdoorSpace": true,
    "hasParking": true,
    "streetAddress": "123 Main Street",
    "postcode": "SW1A 1AA",
    "useClass": "C2 - Residential Institutions",
    "alterationsAllowed": true,
    "businessModels": ["Care Home", "Assisted Living"],
    "epcRating": "B",
    "furnished": false,
    "wheelchairAccessible": true,
    "hasHMOLicence": true,
    "hmoLicenceFor": 8,
    "desiredRent": "4500",
    "leaseLength": "5 years",
    "description": "Beautiful property perfect for care home use"
  }'
```

### 4. Get My Properties (Auth Required)
```bash
curl http://localhost:5000/api/properties/my/listings \
  -H "x-user-id: landlord123"
```

### 5. Update Property (Auth Required, Owner Only)
```bash
curl -X PUT http://localhost:5000/api/properties/PROPERTY_ID \
  -H "Content-Type: application/json" \
  -H "x-user-id: landlord123" \
  -d '{
    "desiredRent": "5000",
    "description": "Updated description"
  }'
```

### 6. Delete Property (Auth Required, Owner Only)
```bash
curl -X DELETE http://localhost:5000/api/properties/PROPERTY_ID \
  -H "x-user-id: landlord123"
```

---

## 💼 Wanted Ads API

### 1. Get All Wanted Ads (Public)
```bash
curl http://localhost:5000/api/wanted-ads
```

**With filters:**
```bash
curl "http://localhost:5000/api/wanted-ads?businessType=Care%20Home&minBedrooms=4"
```

**Query Parameters:**
- `businessType` - Care Home, Rent-to-Rent, etc.
- `minBedrooms` - Minimum bedrooms required
- `location` - Search by location (partial match)
- `wheelchairAccessible` - true/false

### 2. Get Wanted Ad by ID (Public)
```bash
curl http://localhost:5000/api/wanted-ads/AD_ID
```

### 3. Create Wanted Ad (Auth Required)
```bash
curl -X POST http://localhost:5000/api/wanted-ads \
  -H "Content-Type: application/json" \
  -H "x-user-id: business123" \
  -H "x-user-ispaid: false" \
  -d '{
    "businessName": "ABC Care Solutions",
    "businessEmail": "contact@abccare.com",
    "businessType": "Care Home",
    "companyName": "ABC Care Solutions Ltd",
    "propertyType": "Detached",
    "minBedrooms": 6,
    "minEnSuites": 4,
    "minKitchens": 1,
    "minReceptionRooms": 2,
    "needsOutdoorSpace": true,
    "needsParking": true,
    "preferredLocation": "London, South West",
    "preferredPostcodes": "SW15, SW19",
    "useClass": "C2 - Residential Institutions",
    "minEpcRating": "C",
    "needsWheelchairAccessible": true,
    "maxBudget": "5000",
    "desiredLeaseLength": "5 years",
    "description": "Looking for suitable property for care home"
  }'
```

### 4. Get My Wanted Ads (Auth Required)
```bash
curl http://localhost:5000/api/wanted-ads/my/listings \
  -H "x-user-id: business123"
```

### 5. Update Wanted Ad (Auth Required, Owner Only)
```bash
curl -X PUT http://localhost:5000/api/wanted-ads/AD_ID \
  -H "Content-Type: application/json" \
  -H "x-user-id: business123" \
  -d '{
    "maxBudget": "6000"
  }'
```

### 6. Delete Wanted Ad (Auth Required, Owner Only)
```bash
curl -X DELETE http://localhost:5000/api/wanted-ads/AD_ID \
  -H "x-user-id: business123"
```

---

## 🔒 Freemium Model

### Free Users
- Can post **1 property** or **1 wanted ad**
- Attempting to post more returns:
```json
{
  "success": false,
  "message": "Free users can only post 1 listing. Upgrade to Pro for unlimited listings.",
  "upgradeUrl": "/pricing"
}
```

### Paid Users
- **Unlimited** properties and wanted ads
- Set header: `x-user-ispaid: true`

---

## 🧪 Testing with PowerShell

### Get all properties:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/properties" | Select-Object -ExpandProperty Content
```

### Create a property:
```powershell
$body = @{
  landlordName = "Test Landlord"
  landlordEmail = "test@example.com"
  propertyType = "Detached"
  bedrooms = 5
  streetAddress = "Test Street"
  postcode = "SW1A 1AA"
  useClass = "C3 - Dwelling Houses"
  businessModels = @("Rent-to-Rent")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/properties" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "x-user-id"="test123"; "x-user-ispaid"="false"} `
  -Body $body
```

---

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🎯 Next Steps

1. **Test the endpoints** using the examples above
2. **Frontend integration** - Update React app to use API instead of localStorage
3. **Add real JWT authentication** - Replace header-based auth
4. **File uploads** - Add Cloudinary/AWS S3 for property photos
5. **Deploy backend** - Host on Render, Railway, or Heroku

---

## 💡 Tips

- Use **Postman** or **Insomnia** for easier API testing
- Check browser DevTools Network tab to debug requests
- Frontend is still using mock data - update AuthContext and forms to call these APIs
- MongoDB Compass can help visualize your database

