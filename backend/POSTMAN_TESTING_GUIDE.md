# Postman Testing Guide

## Quick Setup

### Option 1: Import Collection (RECOMMENDED)
1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Browse to: `Intake-Builder-API.postman_collection.json`
5. Click **Import**
6. You'll see "Intake Builder API" collection with 15 ready-to-test requests!

### Option 2: Manual Testing
Use the examples below to manually create requests in Postman.

---

## Base URL
```
http://localhost:3001/api
```

**Make sure your backend server is running:**
```bash
cd backend
npm run dev
```

---

## Test Requests

### 1. Health Check ✅
**Method:** `GET`  
**URL:** `http://localhost:3001/api/health`

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Intake Builder API is running",
  "timestamp": "2025-10-23T09:32:27.566Z"
}
```

---

### 2. Get All Request Types 📋
**Method:** `GET`  
**URL:** `http://localhost:3001/api/request-types`

**Expected Response:**
```json
{
  "data": [
    { "id": "...", "requestType": "NDA Request - Sales", ... },
    { "id": "...", "requestType": "MSA Review Request - Procurement", ... }
  ]
}
```

---

### 3. Get Single Request Type 🔍
**Method:** `GET`  
**URL:** `http://localhost:3001/api/request-types/550e8400-e29b-41d4-a716-446655440000`

**Expected Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "requestType": "NDA Request - Sales",
    "purpose": "...",
    "fields": [...],
    "owner": "legal@company.com"
  }
}
```

---

### 4. Create New Request Type ➕
**Method:** `POST`  
**URL:** `http://localhost:3001/api/request-types`  
**Headers:** 
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "requestType": "Partnership Agreement - Business Development",
  "purpose": "Partnership agreement for strategic business partnerships and joint ventures. Use when establishing formal partnerships with other organizations.",
  "fields": [
    {
      "label": "Partner Organization Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter partner company name"
    },
    {
      "label": "Partnership Type",
      "type": "select",
      "required": true,
      "options": ["Strategic Alliance", "Joint Venture", "Distribution Partnership", "Technology Partnership"]
    },
    {
      "label": "Partnership Scope",
      "type": "long-text",
      "required": true,
      "placeholder": "Describe the scope of the partnership..."
    },
    {
      "label": "Proposed Start Date",
      "type": "date",
      "required": true
    },
    {
      "label": "Revenue Sharing",
      "type": "select",
      "required": false,
      "options": ["50/50", "60/40", "70/30", "Other"]
    }
  ],
  "owner": "bizdev@company.com"
}
```

**Expected Response:** `201 Created`
```json
{
  "data": {
    "id": "generated-uuid",
    "requestType": "Partnership Agreement - Business Development",
    "purpose": "...",
    "fields": [...],
    "owner": "bizdev@company.com",
    "createdAt": "2025-10-23T...",
    "updatedAt": "2025-10-23T..."
  }
}
```

---

### 5. Update Request Type (Partial Update) ✏️
**Method:** `PUT`  
**URL:** `http://localhost:3001/api/request-types/550e8400-e29b-41d4-a716-446655440000`  
**Headers:** 
- `Content-Type: application/json`

**Body (update owner only):**
```json
{
  "owner": "legal-operations@company.com"
}
```

**Body (update purpose only):**
```json
{
  "purpose": "Updated NDA purpose: This agreement protects confidential information shared during business negotiations and partnerships."
}
```

**Body (update multiple fields):**
```json
{
  "requestType": "NDA Request - Sales & Marketing",
  "owner": "legal@company.com",
  "purpose": "NDA for sales and marketing activities involving confidential information."
}
```

**Expected Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "requestType": "NDA Request - Sales & Marketing",
    "purpose": "NDA for sales and marketing activities...",
    "owner": "legal@company.com",
    "createdAt": "2025-10-20T10:30:00.000Z",
    "updatedAt": "2025-10-23T..." // Auto-updated!
  }
}
```

---

### 6. Delete Request Type 🗑️
**Method:** `DELETE`  
**URL:** `http://localhost:3001/api/request-types/8247c71b-250b-4204-9075-3ccb1879870e`

**Expected Response:**
```json
{
  "success": true,
  "message": "Request type deleted successfully"
}
```

---

## Testing Validation & Errors

### 7. Validation Error - Empty Fields ❌
**Method:** `POST`  
**URL:** `http://localhost:3001/api/request-types`  
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "requestType": "",
  "purpose": "Short",
  "fields": [],
  "owner": "invalid-email"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "path": ["requestType"],
      "message": "Request type name is required"
    },
    {
      "code": "too_small",
      "path": ["purpose"],
      "message": "Purpose must be at least 10 characters"
    },
    {
      "code": "invalid_format",
      "path": ["owner"],
      "message": "Valid email is required"
    }
  ]
}
```

---

### 8. 404 Error - Non-existent Resource ❌
**Method:** `GET`  
**URL:** `http://localhost:3001/api/request-types/non-existent-id-123`

**Expected Response:** `404 Not Found`
```json
{
  "error": "Request type not found"
}
```

---

## Field Types Reference

When creating/updating request types, use these field types:

### Text Field
```json
{
  "label": "Company Name",
  "type": "text",
  "required": true,
  "placeholder": "Enter company name"
}
```

### Long Text Field (Textarea)
```json
{
  "label": "Description",
  "type": "long-text",
  "required": true,
  "placeholder": "Provide detailed description..."
}
```

### Date Field
```json
{
  "label": "Effective Date",
  "type": "date",
  "required": true
}
```

### Select Field (Dropdown)
```json
{
  "label": "Contract Type",
  "type": "select",
  "required": true,
  "options": ["NDA", "MSA", "SOW", "Amendment"]
}
```

---

## Testing Checklist

Use this checklist to verify all functionality:

- [ ] ✅ GET `/api/health` - Health check works
- [ ] 📋 GET `/api/request-types` - Returns all request types
- [ ] 🔍 GET `/api/request-types/:id` - Returns single request type
- [ ] ➕ POST `/api/request-types` - Creates new request type
- [ ] ✏️ PUT `/api/request-types/:id` - Updates request type
- [ ] 🗑️ DELETE `/api/request-types/:id` - Deletes request type
- [ ] ❌ POST with invalid data - Returns 400 validation errors
- [ ] ❌ GET non-existent ID - Returns 404 error
- [ ] 🔄 Verify `createdAt` doesn't change on update
- [ ] 🔄 Verify `updatedAt` changes on update
- [ ] 🆔 Verify UUIDs are auto-generated for new records
- [ ] 🆔 Verify field IDs are auto-generated if not provided

---

## Quick Test Flow

**Recommended testing sequence:**

1. **Health Check** - Verify server is running
2. **Get All** - See existing data
3. **Create** - Add a new request type
4. **Get All** - Verify new item appears
5. **Get Single** - Fetch the new item by ID
6. **Update** - Modify the item
7. **Get Single** - Verify changes
8. **Delete** - Remove the item
9. **Get All** - Verify it's deleted
10. **Validation Tests** - Test error handling

---

## Current Database IDs

Use these IDs for testing existing records:

- **NDA Request - Sales**: `550e8400-e29b-41d4-a716-446655440000`
- **MSA Review Request - Procurement**: `550e8400-e29b-41d4-a716-446655440001`
- **Software License Agreement - IT**: `8247c71b-250b-4204-9075-3ccb1879870e`

---

## Tips

1. **Use Postman Collections** - Organize your requests
2. **Use Environment Variables** - Set `{{baseUrl}}` = `http://localhost:3001/api`
3. **Save Responses** - Use Examples to save successful responses
4. **Check Status Codes** - Verify 200, 201, 400, 404, 500
5. **Format JSON** - Use Postman's "Beautify" option
6. **View db.json** - Check `backend/db.json` to see actual data

---

## Troubleshooting

**Server not responding?**
```bash
# Check if server is running
curl http://localhost:3001/api/health

# If not, start the server
cd backend
npm run dev
```

**Port already in use?**
```bash
# Find process on port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Restart server
npm run dev
```

**Database changes not persisting?**
- Check `backend/db.json` file exists
- Verify write permissions
- Check server logs for errors

---

Happy Testing! 🚀

