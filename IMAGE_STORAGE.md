# Image Storage Implementation

## Current Implementation

Images are currently stored **as base64-encoded data URLs directly in the MongoDB database**. This is a simple solution that works well for development and small-scale deployments.

### How It Works

1. **Upload**: When users select images in the property listing form, files are converted to base64 data URLs on the client side
2. **Storage**: The base64 strings are stored in the `photos` array field in the Property document
3. **Display**: Images are displayed directly from the base64 data URLs using `<img src="data:image/jpeg;base64,..." />`

### File Limits

- **Max photos per property**: 10
- **Max file size per photo**: 5MB
- **Max file size for floor plan**: 10MB
- **Supported formats**: JPG, PNG for photos; JPG, PNG, PDF for floor plans

## Advantages of Base64 Storage

✅ **Simple**: No additional infrastructure needed  
✅ **Works immediately**: No cloud storage setup required  
✅ **Self-contained**: All data in one database  
✅ **Good for small images**: Efficient for thumbnails and small photos  

## Limitations

⚠️ **Database size**: Each image increases database size significantly  
⚠️ **Performance**: Large images slow down database queries  
⚠️ **Memory**: Loading many properties with images uses more memory  
⚠️ **Not scalable**: Not ideal for production with many users/images  

## Production Recommendation

For production, consider migrating to cloud storage:

### Recommended: Cloudinary
- **Free tier**: 25GB storage, 25GB bandwidth/month
- **Features**: Automatic image optimization, resizing, CDN
- **Easy integration**: Simple upload API
- **URL**: https://cloudinary.com

### Alternative: AWS S3
- **Scalable**: Handle unlimited storage
- **Cost**: Pay per GB storage and transfer
- **More setup**: Requires AWS account and configuration

### Migration Path

1. Set up cloud storage service
2. Create upload endpoint on backend
3. Update frontend to upload to your backend endpoint
4. Backend uploads to cloud storage and stores URLs in database
5. Update display components to use cloud URLs
6. Optionally migrate existing base64 images to cloud storage

## Current Image Handling

### Frontend (`src/pages/AddPropertyPage.jsx`)
- `handlePhotoChange()`: Converts selected files to base64
- `handleRemovePhoto()`: Removes photo from array
- Photos are included in form submission

### Display (`src/components/PropertyCard.jsx`, `src/pages/PropertyDetailPage.jsx`)
- Shows first photo if available
- Falls back to placeholder icon if no photos
- Property detail page shows main image + thumbnail gallery

### Backend (`backend/models/Property.js`)
- `photos` field: Array of strings (base64 data URLs)
- Stored and retrieved automatically with property data

## Testing

1. Go to "Add Property" page
2. Upload photos using the file input
3. See preview thumbnails
4. Submit property
5. Verify photos appear in property card and detail page

## Future Improvements

- [ ] Add image compression before base64 encoding
- [ ] Implement cloud storage migration
- [ ] Add image optimization/resizing
- [ ] Support drag-and-drop upload
- [ ] Add image reordering
- [ ] Add image captions/descriptions

