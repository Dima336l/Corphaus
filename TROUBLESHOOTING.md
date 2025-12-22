# Troubleshooting Guide

## Property Creation Error (400 Bad Request)

If you're getting a 400 error when creating a property, here are the common causes and solutions:

### 1. User Not Logged In
**Symptom**: Error message "Authentication required" or "User ID is missing"

**Solution**:
- Make sure you're logged in as a landlord
- Check that the user session is stored in localStorage
- Try logging out and logging back in

### 2. Missing Required Fields
**Symptom**: Error message "Validation error" or "Missing required property information"

**Required Fields**:
- Property Type
- Street Address
- Postcode
- Use Class
- At least one Business Model

**Solution**:
- Fill in all required fields in the form
- Make sure "Use Class" is selected (it's a required dropdown)

### 3. User Profile Incomplete
**Symptom**: Error message "User profile is incomplete"

**Solution**:
- Make sure your user account has a name and email
- If you signed up without these, try logging out and creating a new account

### 4. Missing User ID
**Symptom**: Error message "User ID is missing"

**Solution**:
- Check that you're logged in
- Check browser console for user object
- Try logging out and logging back in

### 5. Backend Validation Errors
**Symptom**: Error message with validation details

**Solution**:
- Check the error message for specific field validation errors
- Make sure all data is in the correct format
- Check backend terminal for detailed error logs

## How to Debug

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check the error details for specific field issues

### Check Backend Logs
1. Look at the backend terminal
2. Check for error messages when creating a property
3. Look for validation errors or missing fields

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try creating a property
4. Click on the failed request
5. Check the Response tab for error details

### Test API Directly
You can test the API directly using curl:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test creating a property (replace USER_ID with actual user ID)
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "x-user-id: USER_ID" \
  -d '{
    "propertyType": "Detached",
    "streetAddress": "123 Test Street",
    "postcode": "SW1A 1AA",
    "useClass": "C2 - Residential Institutions",
    "landlordName": "Test User",
    "landlordEmail": "test@example.com",
    "businessModels": ["Care Home"]
  }'
```

## Common Issues

### Issue: "Error creating property" with no details
**Solution**: Check backend terminal for detailed error logs. The backend now logs more information about validation errors.

### Issue: Properties page shows empty
**Solution**: 
- Check that backend is running on port 5000
- Check that MongoDB is connected
- Check browser console for API errors
- Verify API URL in `.env` file is correct

### Issue: Can't log in
**Solution**:
- Check that backend is running
- Check that auth API endpoints are working
- Check browser console for errors
- Verify user credentials are correct

## Getting Help

If you're still having issues:

1. Check the browser console for error messages
2. Check the backend terminal for server logs
3. Check the Network tab in DevTools for API responses
4. Verify all environment variables are set correctly
5. Make sure MongoDB is connected (if using database)
6. Check that all required fields are filled in

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] MongoDB is connected (if using database)
- [ ] User is logged in
- [ ] User has a name and email
- [ ] All required fields are filled in
- [ ] At least one business model is selected
- [ ] Use class is selected
- [ ] No validation errors in form

