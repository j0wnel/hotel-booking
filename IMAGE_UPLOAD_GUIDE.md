# Image Upload Feature

## Overview
The image upload system allows admin users to upload room images directly through the admin interface.

## Features
- ✅ File upload with validation (JPG, PNG, GIF, WebP)
- ✅ Maximum file size: 5MB
- ✅ Automatic filename generation (prevents conflicts)
- ✅ Image preview before upload
- ✅ Admin-only access (requires authentication)
- ✅ CORS enabled for cross-origin requests

## Upload Endpoint
**URL:** `http://localhost/hotel-booking/api/controllers/upload.php`  
**Method:** `POST`  
**Auth:** Required (Admin only)  
**Content-Type:** `multipart/form-data`

### Request Headers
```
Authorization: Bearer {token}
```

### Request Body
```
FormData with key: 'image'
File: image file (JPG, PNG, GIF, WebP)
```

### Success Response (200)
```json
{
  "message": "File uploaded successfully.",
  "filename": "room_6723abc123.jpg",
  "path": "uploads/rooms/room_6723abc123.jpg",
  "url": "http://localhost/hotel-booking/api/uploads/rooms/room_6723abc123.jpg"
}
```

### Error Responses

**400 - No File Uploaded**
```json
{
  "message": "No file uploaded."
}
```

**400 - Invalid File Type**
```json
{
  "message": "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed."
}
```

**400 - File Too Large**
```json
{
  "message": "File too large. Maximum size is 5MB."
}
```

**401 - Unauthorized**
```json
{
  "message": "Unauthorized"
}
```

**403 - Forbidden (Non-Admin)**
```json
{
  "message": "Forbidden"
}
```

## File Storage
- **Directory:** `api/uploads/rooms/`
- **Naming:** `room_{unique_id}.{extension}`
- **Permissions:** 0755

## Usage in Admin Interface

### 1. Navigate to Admin Rooms Page
```
/admin/rooms
```

### 2. Add/Edit Room
- Click "Add New Room" or "Edit" on existing room
- In the modal, find the "Room Image" section
- Click "Choose File" and select an image
- Image will automatically upload and preview will appear
- Submit the form to save the room with the uploaded image

### 3. Alternative: Manual URL Entry
You can also manually enter image URLs in the text field below the file upload.

## Image Display
Uploaded images are displayed:
- **Admin Rooms Table:** 100x60px thumbnails
- **Rooms Listing Page:** 800x600px cards
- **Room Details Page:** Full-size hero image

## File Validation
- **Allowed Types:** image/jpeg, image/jpg, image/png, image/gif, image/webp
- **Max Size:** 5MB (5,242,880 bytes)
- **MIME Type Check:** Uses finfo_file() for accurate detection

## Security
- ✅ Admin authentication required
- ✅ File type validation (MIME type check)
- ✅ File size validation
- ✅ Unique filename generation (prevents overwrites)
- ✅ Stored outside public web root (in api/uploads/)
- ✅ CORS headers configured

## Testing
Use the test page: `http://localhost/hotel-booking/api/test-upload.html`

1. Login as admin first to get token
2. Open test page
3. Select an image
4. Click Upload
5. View result (including uploaded image URL)

## Troubleshooting

### Upload fails with 401
- Make sure you're logged in as admin
- Check if token exists in localStorage
- Verify token hasn't expired

### Upload fails with 403
- Only admin users can upload images
- Check your user role in database

### File not appearing after upload
- Check file permissions on uploads directory
- Verify .htaccess allows image access
- Check browser console for CORS errors

### Image not displaying
- Verify the image path in database matches uploaded file
- Check if file exists in `api/uploads/rooms/` directory
- Ensure Apache is serving files from uploads directory
