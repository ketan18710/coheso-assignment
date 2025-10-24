# Backend API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: (Set via environment variable)

## Endpoints

### Health Check
**GET** `/api/health`

Returns the API health status.

**Response:**
```json
{
  "status": "ok",
  "message": "Intake Builder API is running",
  "timestamp": "2025-10-23T09:32:27.566Z"
}
```

---

### Get All Request Types
**GET** `/api/request-types`

Retrieves all request types.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "requestType": "NDA Request - Sales",
      "purpose": "Request to establish a sales NDA...",
      "fields": [...],
      "owner": "legal@company.com",
      "createdAt": "2025-10-20T10:30:00.000Z",
      "updatedAt": "2025-10-20T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Request Type
**GET** `/api/request-types/:id`

Retrieves a single request type by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "requestType": "NDA Request - Sales",
    ...
  }
}
```

**Error (404):**
```json
{
  "error": "Request type not found"
}
```

---

### Create Request Type
**POST** `/api/request-types`

Creates a new request type.

**Request Body:**
```json
{
  "requestType": "Software License Agreement - IT",
  "purpose": "Software license agreement review...",
  "fields": [
    {
      "label": "Software Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter software name"
    },
    {
      "label": "License Type",
      "type": "select",
      "required": true,
      "options": ["Perpetual", "Subscription"]
    }
  ],
  "owner": "it@company.com"
}
```

**Field Types:**
- `text` - Single line input
- `long-text` - Multi-line textarea
- `date` - Date picker
- `select` - Dropdown (requires `options` array)

**Response (201):**
```json
{
  "data": {
    "id": "generated-uuid",
    "requestType": "Software License Agreement - IT",
    "purpose": "Software license agreement review...",
    "fields": [...],
    "owner": "it@company.com",
    "createdAt": "2025-10-23T09:32:48.909Z",
    "updatedAt": "2025-10-23T09:32:48.909Z"
  }
}
```

**Validation Errors (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "path": ["requestType"],
      "message": "Request type name is required"
    }
  ]
}
```

---

### Update Request Type
**PUT** `/api/request-types/:id`

Updates an existing request type. All fields are optional.

**Request Body:**
```json
{
  "purpose": "Updated purpose text",
  "owner": "newemail@company.com"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "requestType": "NDA Request - Sales",
    "purpose": "Updated purpose text",
    "owner": "newemail@company.com",
    "createdAt": "2025-10-20T10:30:00.000Z",
    "updatedAt": "2025-10-23T10:00:00.000Z"
  }
}
```

**Note:** `createdAt` is preserved, `updatedAt` is automatically updated.

---

### Delete Request Type
**DELETE** `/api/request-types/:id`

Deletes a request type.

**Response:**
```json
{
  "success": true,
  "message": "Request type deleted successfully"
}
```

**Error (404):**
```json
{
  "error": "Request type not found"
}
```

---

## Running the Backend

### Development
```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Production
```bash
npm run build
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Testing

Use curl, Postman, or Thunder Client to test endpoints:

```bash
# Get all request types
curl http://localhost:3001/api/request-types

# Create new request type
curl -X POST http://localhost:3001/api/request-types \
  -H "Content-Type: application/json" \
  -d '{"requestType": "Test", "purpose": "Test purpose...", "fields": [], "owner": "test@test.com"}'
```

