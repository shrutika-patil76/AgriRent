# 📡 API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",
  "phone": "+91-9876543210",
  "address": "Punjab, India"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

---

## 🛠️ Tools/Equipment Endpoints

### Get All Tools
```http
GET /tools
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name
- `minPrice` (optional): Minimum price per day
- `maxPrice` (optional): Maximum price per day

**Example:**
```http
GET /tools?category=Tractor&minPrice=1000&maxPrice=3000
```

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Deere 5050D Tractor",
    "description": "Powerful 50HP tractor...",
    "category": "Tractor",
    "pricePerDay": 2500,
    "deposit": 10000,
    "location": "Punjab, India",
    "rating": 4.5,
    "reviewCount": 12,
    "available": true,
    "owner": {
      "_id": "...",
      "name": "Owner Name",
      "email": "owner@example.com",
      "phone": "+91-9876543210"
    }
  }
]
```

### Get Single Tool
```http
GET /tools/:id
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "name": "John Deere 5050D Tractor",
  "description": "Powerful 50HP tractor...",
  "category": "Tractor",
  "pricePerDay": 2500,
  "deposit": 10000,
  "images": ["url1", "url2"],
  "location": "Punjab, India",
  "rating": 4.5,
  "reviewCount": 12,
  "specifications": {
    "brand": "John Deere",
    "model": "5050D",
    "year": 2022,
    "condition": "Excellent"
  },
  "owner": {
    "_id": "...",
    "name": "Owner Name",
    "phone": "+91-9876543210"
  }
}
```

### Create Tool (Owner/Admin Only)
```http
POST /tools
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Deere 5050D Tractor",
  "description": "Powerful 50HP tractor suitable for all farming operations",
  "category": "Tractor",
  "pricePerDay": 2500,
  "deposit": 10000,
  "location": "Punjab, India",
  "specifications": {
    "brand": "John Deere",
    "model": "5050D",
    "year": 2022,
    "condition": "Excellent"
  }
}
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "name": "John Deere 5050D Tractor",
  ...
}
```

### Update Tool
```http
PUT /tools/:id
Authorization: Bearer <token>
```

**Request Body:** (Same as Create Tool)

### Delete Tool
```http
DELETE /tools/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Tool deleted"
}
```

---

## 📅 Booking Endpoints

### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "toolId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "startDate": "2026-04-01",
  "endDate": "2026-04-05"
}
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "user": "user_id",
  "tool": "tool_id",
  "startDate": "2026-04-01T00:00:00.000Z",
  "endDate": "2026-04-05T00:00:00.000Z",
  "totalDays": 4,
  "totalAmount": 10000,
  "deposit": 10000,
  "status": "pending",
  "paymentStatus": "pending"
}
```

### Get My Bookings
```http
GET /bookings/my-bookings
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "...",
    "tool": {
      "_id": "...",
      "name": "John Deere 5050D Tractor",
      "pricePerDay": 2500
    },
    "startDate": "2026-04-01T00:00:00.000Z",
    "endDate": "2026-04-05T00:00:00.000Z",
    "totalDays": 4,
    "totalAmount": 10000,
    "status": "confirmed"
  }
]
```

### Get All Bookings (Admin Only)
```http
GET /bookings
Authorization: Bearer <token>
```

### Update Booking Status
```http
PATCH /bookings/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

---

## ⭐ Review Endpoints

### Create Review
```http
POST /reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "toolId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "rating": 5,
  "comment": "Excellent tractor! Very well maintained."
}
```

**Response:**
```json
{
  "_id": "...",
  "user": "user_id",
  "tool": "tool_id",
  "rating": 5,
  "comment": "Excellent tractor! Very well maintained.",
  "createdAt": "2026-03-25T..."
}
```

### Get Tool Reviews
```http
GET /reviews/tool/:toolId
```

**Response:**
```json
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "name": "John Doe"
    },
    "rating": 5,
    "comment": "Excellent tractor! Very well maintained.",
    "createdAt": "2026-03-25T..."
  }
]
```

---

## 👑 Admin Endpoints

### Get Dashboard Stats
```http
GET /admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalTools": 45,
  "totalBookings": 230,
  "activeBookings": 12
}
```

### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer",
    "phone": "+91-9876543210",
    "createdAt": "2026-01-15T..."
  }
]
```

### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User deleted"
}
```

---

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 📝 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with Postman

### Setup
1. Create a new collection "AgriRent API"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:5000/api`
3. Create environment with token variable

### Test Flow
1. Register a user → Save token
2. Login → Update token
3. Create tool (as owner)
4. Get all tools
5. Create booking (as farmer)
6. Get my bookings
7. Create review
8. Get admin stats (as admin)

---

## 📊 Rate Limiting

Currently no rate limiting implemented. For production:
- Implement rate limiting middleware
- Suggested: 100 requests per 15 minutes per IP

---

## 🔄 API Versioning

Current version: v1 (implicit)

Future versions can be added:
- `/api/v1/...`
- `/api/v2/...`

---

**For more details, check the route files in `backend/routes/`**
