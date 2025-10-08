# 🧪 Corphaus Test Accounts

Use these accounts to test the platform and see the different user interfaces!

---

## 👤 FREE LANDLORD ACCOUNT

**Email:** `landlord@test.com`  
**Password:** `password123`  
**Role:** Landlord  
**Plan:** Free (1 property listing limit)

### 📦 What's In This Account:
- **1 Property Listed:** Semi-Detached HMO in SW15 3QR
- **At Free Tier Limit:** Cannot post more without upgrading

### What You'll See:
- ✅ Blue "Landlord" badge in header
- ✅ Menu: Browse Wanted Ads | List Property | Dashboard
- ✅ Dashboard shows 1 active property
- ✅ See matching businesses (4 wanted ads match your property!)
- ❌ Contact details are blurred (upgrade to access)
- ❌ Blocked from posting 2nd property (free limit)

---

## 💼 FREE BUSINESS ACCOUNT

**Email:** `business@test.com`  
**Password:** `password123`  
**Role:** Business  
**Plan:** Free (1 wanted ad limit)

### 📦 What's In This Account:
- **1 Wanted Ad Posted:** Looking for Care Home property in London SW
- **At Free Tier Limit:** Cannot post more without upgrading

### What You'll See:
- ✅ Purple "Business" badge in header
- ✅ Menu: Browse Properties | Post Wanted Ad | Dashboard
- ✅ Dashboard shows 1 active wanted ad
- ✅ See matching properties (5 properties available!)
- ❌ Contact details are blurred (upgrade to access)
- ❌ Blocked from posting 2nd wanted ad (free limit)

---

## 👤 PRO LANDLORD ACCOUNT

**Email:** `landlord.pro@test.com`  
**Password:** `password123`  
**Role:** Landlord  
**Plan:** **Pro (Paid)** ✨

### 📦 What's In This Account:
- **3 Properties Listed:**
  1. Detached Care Home property in SW15 (£4,500/mo)
  2. Block of Flats in E14 (£6,800/mo)
  3. Terraced house in Manchester (£2,800/mo)
- **No Limits:** Can post unlimited more!

### What You'll See:
- ✅ Blue "Landlord" badge + Gold "Pro" badge in header
- ✅ Menu: Browse Wanted Ads | List Property | Dashboard
- ✅ Dashboard shows 3 active properties
- ✅ **Unlimited property listings** - add as many as you want!
- ✅ **Full contact details visible** on wanted ads (no blur!)
- ✅ Pro badge shows premium status

---

## 💼 PRO BUSINESS ACCOUNT

**Email:** `business.pro@test.com`  
**Password:** `password123`  
**Role:** Business  
**Plan:** **Pro (Paid)** ✨

### 📦 What's In This Account:
- **3 Wanted Ads Posted:**
  1. Corporate Lets in London Central (£8,000/mo budget)
  2. Rent-to-Rent in Manchester/Birmingham (£2,500/mo budget)
  3. Nursery property in London West (£4,000/mo budget)
- **No Limits:** Can post unlimited more!

### What You'll See:
- ✅ Purple "Business" badge + Gold "Pro" badge in header
- ✅ Menu: Browse Properties | Post Wanted Ad | Dashboard
- ✅ Dashboard shows 3 active wanted ads
- ✅ **Unlimited wanted ads** - add as many as you want!
- ✅ **Full contact details visible** on properties (no blur!)
- ✅ Pro badge shows premium status

---

## 🎯 Testing Scenarios

### Scenario 1: Compare Free vs Pro (Landlord)
1. Log in with `landlord@test.com`
2. Try to view property details → Contact info blurred
3. Go to Pricing → Try to upgrade (mock payment)
4. Log out
5. Log in with `landlord.pro@test.com`
6. View same property → Contact info visible! ✅

### Scenario 2: Compare Landlord vs Business Menus
1. Log in with `landlord@test.com`
2. Notice menu: "Browse Wanted Ads" + "List Property"
3. Check header badge: Blue "Landlord"
4. Log out
5. Log in with `business@test.com`
6. Notice menu changed: "Browse Properties" + "Post Wanted Ad"
7. Check header badge: Purple "Business"

### Scenario 3: Test Listing Limits (Free)
1. Log in with `landlord@test.com` (free)
2. Go to Dashboard → List Property
3. Create first property → Success! ✅
4. Try to create second property → Blocked! Upgrade prompt
5. Log out
6. Log in with `landlord.pro@test.com` (pro)
7. Create multiple properties → All work! ✅

### Scenario 4: Mobile Navigation
1. Resize browser to mobile width
2. Click hamburger menu
3. Log in with different accounts
4. See how mobile menu changes per role
5. Notice role badges at top of menu

---

## 🔑 Quick Login Test

### Test Backend Auth:

```powershell
# Test login endpoint
$body = @{
  email = "landlord@test.com"
  password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body | Select-Object -ExpandProperty Content
```

### Test Frontend:
1. Open: http://localhost:5173
2. Click "Log In"
3. Enter: `landlord@test.com` / `password123`
4. Click "Log In"
5. You should be redirected to Landlord Dashboard!

---

## 🎨 Visual Differences:

### Guest User:
```
Header: [Logo] Browse Properties | Wanted Ads | Pricing | Contact | Log In | Sign Up
```

### Landlord (Free):
```
Header: [Logo] 💼 Browse Wanted Ads | ➕ List Property | 📊 Dashboard | Pricing | [🏠 John Smith | Landlord] | Logout
```

### Business (Free):
```
Header: [Logo] 🏠 Browse Properties | ➕ Post Wanted Ad | 📊 Dashboard | Pricing | [💼 ABC Care | Business] | Logout
```

### Landlord (Pro):
```
Header: [Logo] 💼 Browse Wanted Ads | ➕ List Property | 📊 Dashboard | Pricing | [🏠 Premium Estates | Landlord | Pro] | Logout
```

### Business (Pro):
```
Header: [Logo] 🏠 Browse Properties | ➕ Post Wanted Ad | 📊 Dashboard | Pricing | [💼 Elite Corporate | Business | Pro] | Logout
```

---

## 🔐 Security Notes

- **Passwords are hashed** using bcrypt (secure!)
- **All passwords:** `password123` (easy to remember for testing)
- **These are TEST accounts** - Change passwords before production!

---

## 📱 What to Test:

✅ Different navigation menus per role  
✅ Different colored badges (Blue = Landlord, Purple = Business)  
✅ Free tier limits (1 listing)  
✅ Pro tier unlimited access  
✅ Contact detail blur (free) vs visible (pro)  
✅ Mobile responsive menus  
✅ Dashboard differences  

---

**Ready to test!** 🎉

Just open http://localhost:5173 and try logging in with any of these accounts!

