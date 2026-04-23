# 🚜 AgriRent - Smart Agricultural Equipment Rental System

A full-stack MERN application for renting agricultural equipment with integrated payment gateway, email notifications, and real-time location services.

## 🎯 Project Overview

AgriRent is a comprehensive platform connecting farmers who need agricultural equipment with owners who want to rent out their machinery. Think of it as "Airbnb for Farm Equipment" with features like online payments, automated email notifications, and location-based search.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Detailed Functionality](#-detailed-functionality)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)

---

## ✨ Features

### 👨‍🌾 For Farmers
- **Browse Equipment** - Search and filter by category, location, price range
- **View Details** - Specifications, images, reviews, availability calendar
- **Book Equipment** - Select dates with automatic conflict detection
- **Online Payments** - Razorpay integration for deposit and rent payments
- **Track Bookings** - Real-time status updates (Pending → Confirmed → Ongoing → Completed)
- **Write Reviews** - Rate and review equipment after usage
- **Email Notifications** - Automated emails for booking confirmations and payment receipts

### 🚜 For Equipment Owners
- **List Equipment** - Upload images, specifications, pricing
- **Manage Bookings** - Approve/reject requests, track status
- **Payment Tracking** - Monitor deposit and rent payments
- **Email Alerts** - Notifications for new bookings and payments
- **Location Services** - Automatic address detection from coordinates
- **Dashboard Analytics** - View booking history and earnings

### 👨‍💼 For Admins
- **User Management** - View, edit, delete users
- **Equipment Management** - Monitor all listings
- **Platform Analytics** - Track bookings, payments, reviews

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | UI Framework | 18.x |
| **React Router** | Navigation | 6.x |
| **Bootstrap 5** | UI Components | 5.3.x |
| **React Bootstrap** | React-Bootstrap Components | 2.x |
| **Axios** | HTTP Client | 1.x |
| **React Toastify** | Notifications | 9.x |
| **React Icons** | Icon Library | 4.x |
| **Leaflet** | Interactive Maps | 1.9.x |
| **React Leaflet** | React Map Components | 4.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18.x+ |
| **Express.js** | Web Framework | 4.x |
| **MongoDB** | Database | 6.x |
| **Mongoose** | ODM | 8.x |
| **JWT** | Authentication | jsonwebtoken 9.x |
| **Bcrypt** | Password Hashing | 5.x |
| **Multer** | File Upload | 1.x |
| **Nodemailer** | Email Service | 6.x |
| **Razorpay** | Payment Gateway | 2.x |
| **Axios** | HTTP Client | 1.x |
| **CORS** | Cross-Origin Resource Sharing | 2.x |
| **Dotenv** | Environment Variables | 16.x |

### External APIs
| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Nominatim (OpenStreetMap)** | Reverse Geocoding | Free, 1 req/sec limit |
| **Razorpay** | Payment Processing | Test mode available |
| **Gmail SMTP** | Email Delivery | App passwords required |

---

## 🏗️ Project Architecture

```
AgriRent/
├── frontend/                    # React Application
│   ├── public/
│   │   ├── index.html          # HTML template
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable Components
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   ├── PaymentModal.js # Razorpay payment interface
│   │   │   ├── MapComponent.js # Leaflet map display
│   │   │   └── AddressMapPicker.js # Location picker
│   │   ├── pages/              # Page Components
│   │   │   ├── Home.js         # Landing page
│   │   │   ├── Login.js        # Authentication
│   │   │   ├── Register.js     # User registration
│   │   │   ├── ToolListing.js  # Equipment marketplace
│   │   │   ├── ToolDetails.js  # Equipment details & booking
│   │   │   ├── Dashboard.js    # User dashboard
│   │   │   ├── Profile.js      # User profile management
│   │   │   └── AdminPanel.js   # Admin dashboard
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state
│   │   ├── hooks/
│   │   │   └── useReverseGeocode.js # Location name fetching
│   │   ├── styles/             # CSS files
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── models/                 # Mongoose Models
│   │   ├── User.js             # User schema (farmers, owners, admins)
│   │   ├── Tool.js             # Equipment schema
│   │   ├── Booking.js          # Booking/rental schema
│   │   └── Review.js           # Review schema
│   ├── routes/                 # API Routes
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── tools.js            # Equipment CRUD
│   │   ├── bookings.js         # Booking management
│   │   ├── reviews.js          # Review system
│   │   └── payments.js         # Payment processing
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── admin.js            # Admin authorization
│   ├── utils/
│   │   ├── emailService.js     # Email templates & sending
│   │   └── reverseGeocode.js   # Location name resolution
│   ├── uploads/                # Uploaded images
│   │   └── tools/              # Equipment images
│   ├── .env                    # Environment variables
│   ├── server.js               # Express server
│   ├── seed.js                 # Database seeding
│   └── package.json
│
├── scripts/                     # Utility Scripts
│   ├── view-data.js            # View database contents
│   ├── change-role.js          # Change user roles
│   └── reset-password.js       # Reset user passwords
│
├── docs/                        # Documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── USER_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── MONGODB_ATLAS_SETUP.md
│   ├── PROJECT_STARTUP_GUIDE.md
│   └── PRESENTATION_GUIDE.md
│
├── assets/                      # Static Assets
│   └── *.jpg, *.webp, *.avif   # Equipment images
│
├── .gitignore
├── start-all.bat               # Windows quick start
└── README.md
```

---

## 🔧 Detailed Functionality

### 1. Authentication System
**Libraries**: `jsonwebtoken`, `bcryptjs`

**Files**:
- `backend/routes/auth.js` - Authentication endpoints
- `backend/middleware/auth.js` - JWT verification
- `frontend/src/context/AuthContext.js` - Global auth state

**Features**:
- User registration with role selection (Farmer/Owner)
- Password hashing with bcrypt (10 salt rounds)
- JWT token generation (24h expiry)
- Protected routes with middleware
- Persistent login with localStorage

**Flow**:
```
Register → Hash Password → Save to DB → Generate JWT
Login → Verify Password → Generate JWT → Store in localStorage
Protected Route → Verify JWT → Allow/Deny Access
```

### 2. Equipment Management
**Libraries**: `multer`, `mongoose`

**Files**:
- `backend/routes/tools.js` - Equipment CRUD
- `backend/models/Tool.js` - Equipment schema
- `frontend/src/pages/ToolListing.js` - Marketplace
- `frontend/src/pages/ToolDetails.js` - Details page

**Features**:
- Multi-image upload (max 5 images, 5MB each)
- Category-based filtering
- Location-based search
- Price range filtering
- Availability status
- Specifications (brand, model, year, condition)
- Average rating calculation

**Image Upload Flow**:
```
Frontend Form → Multer Middleware → Save to /uploads/tools/ → Store path in DB
Display → Construct URL → http://localhost:5000/uploads/tools/filename.jpg
```

### 3. Booking System
**Libraries**: `mongoose`

**Files**:
- `backend/routes/bookings.js` - Booking management
- `backend/models/Booking.js` - Booking schema
- `frontend/src/pages/Dashboard.js` - Booking dashboard

**Features**:
- Date conflict detection
- Automatic price calculation
- Status workflow (Pending → Confirmed → Ongoing → Completed)
- Cancellation handling
- Booking history

**Booking States**:
```
pending     → Waiting for owner approval
confirmed   → Owner approved, awaiting deposit
ongoing     → Equipment in use
completed   → Rental finished
cancelled   → Cancelled by farmer or owner
```

**Date Conflict Logic**:
```javascript
// Check if new booking overlaps with existing bookings
const hasConflict = existingBookings.some(booking => {
  return (newStart <= booking.endDate && newEnd >= booking.startDate);
});
```

### 4. Payment Integration
**Libraries**: `razorpay`

**Files**:
- `backend/routes/payments.js` - Payment processing
- `frontend/src/components/PaymentModal.js` - Razorpay UI
- `backend/.env` - Razorpay credentials

**Features**:
- Deposit payment (before rental)
- Rent payment (during/after rental)
- Payment verification
- Payment status tracking
- Test mode support

**Payment Flow**:
```
1. Create Order → Backend calls Razorpay API
2. Open Modal → Frontend displays Razorpay checkout
3. Process Payment → User completes payment
4. Verify Payment → Backend verifies signature
5. Update Status → Mark depositPaid/rentPaid as true
6. Send Emails → Notify farmer and owner
```

**Razorpay Integration**:
```javascript
// Backend: Create order
const order = await razorpay.orders.create({
  amount: deposit * 100, // Amount in paise
  currency: 'INR',
  receipt: `deposit_${bookingId}`
});

// Frontend: Open Razorpay
const options = {
  key: RAZORPAY_KEY_ID,
  amount: order.amount,
  order_id: order.id,
  handler: function(response) {
    // Verify payment on backend
  }
};
const rzp = new window.Razorpay(options);
rzp.open();
```

### 5. Email Notification System
**Libraries**: `nodemailer`

**Files**:
- `backend/utils/emailService.js` - Email templates and sending

**Email Types**:
1. **Booking Confirmation** - Sent when owner approves booking
   - Includes: Equipment details, dates, owner contact, payment QR code
2. **Booking Rejection** - Sent when owner rejects booking
3. **Deposit Payment Confirmation** - Sent to farmer after deposit payment
4. **Deposit Payment Notification** - Sent to owner after deposit received
5. **Rent Payment Confirmation** - Sent to farmer after rent payment
6. **Rent Payment Notification** - Sent to owner after rent received
7. **Booking Request** - Sent to owner when farmer makes booking
8. **Cancellation Emails** - Sent to both parties on cancellation

**Email Configuration**:
```javascript
// Gmail SMTP with App Password
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App password, not regular password
  }
});
```

**QR Code in Email**:
```javascript
// Attach QR code as CID (Content-ID)
mailOptions.attachments = [{
  filename: 'payment-qr.png',
  content: base64Data,
  encoding: 'base64',
  cid: 'paymentQR' // Referenced in HTML as <img src="cid:paymentQR">
}];
```

### 6. Location Services
**Libraries**: `axios`, `leaflet`, `react-leaflet`

**Files**:
- `backend/utils/reverseGeocode.js` - Coordinate to address conversion
- `frontend/src/hooks/useReverseGeocode.js` - React hook for location
- `frontend/src/components/MapComponent.js` - Map display
- `frontend/src/components/AddressMapPicker.js` - Location picker

**Features**:
- Interactive map with marker placement
- Reverse geocoding (coordinates → address)
- Location-based equipment search
- Automatic address detection
- Caching to avoid API rate limits
- Request queue for rate limiting

**Reverse Geocoding with Rate Limiting**:
```javascript
// Cache to avoid duplicate requests
const locationCache = new Map();

// Queue to handle rate limiting (1 req/sec for Nominatim)
const requestQueue = [];

const reverseGeocode = async (lat, lon) => {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  
  // Check cache first
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }
  
  // Add to queue and process with 1.1s delay
  const result = await queueRequest(lat, lon);
  locationCache.set(cacheKey, result);
  return result;
};
```

**Nominatim API Call**:
```javascript
const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
  params: {
    format: 'json',
    lat: latitude,
    lon: longitude,
    zoom: 10,
    addressdetails: 1
  },
  headers: {
    'User-Agent': 'AgriRent-App/1.0'
  }
});
```

### 7. Review System
**Libraries**: `mongoose`

**Files**:
- `backend/routes/reviews.js` - Review CRUD
- `backend/models/Review.js` - Review schema
- `frontend/src/pages/ToolDetails.js` - Review display

**Features**:
- Star rating (1-5)
- Text comments
- User verification (only after completed booking)
- Average rating calculation
- Review count tracking

**Rating Calculation**:
```javascript
// Calculate average rating for a tool
const reviews = await Review.find({ tool: toolId });
const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
tool.rating = avgRating;
tool.reviewCount = reviews.length;
await tool.save();
```

### 8. Admin Panel
**Libraries**: `mongoose`

**Files**:
- `backend/middleware/admin.js` - Admin authorization
- `frontend/src/pages/AdminPanel.js` - Admin dashboard

**Features**:
- User management (view, edit, delete)
- Equipment management
- Booking overview
- Platform statistics

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/shrutika-patil76/AgriRent.git
cd AgriRent
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/agri_rental
JWT_SECRET=your_jwt_secret_key_change_in_production
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Get Gmail App Password**:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy 16-character password to EMAIL_PASS

**Get Razorpay Test Keys**:
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate Test Keys
4. Copy Key ID and Secret

Seed database:
```bash
node seed.js
```

Start backend:
```bash
npm start
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### Step 4: Quick Start (Windows)
```bash
# From project root
start-all.bat
```

---

## 🔑 Test Credentials

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Farmer | rajesh.kumar@gmail.com | password123 |
| Owner | amit.singh@gmail.com | password123 |
| Admin | admin@agrirent.com | password123 |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "farmer",
  "address": "123 Main St, City",
  "coordinates": {
    "latitude": 18.5204,
    "longitude": 73.8567
  }
}

Response: {
  "token": "jwt_token_here",
  "user": { ...user_data }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "token": "jwt_token_here",
  "user": { ...user_data }
}
```

### Equipment Endpoints

#### Get All Equipment
```http
GET /tools
Query Parameters:
  - category: string (optional)
  - minPrice: number (optional)
  - maxPrice: number (optional)
  - location: string (optional)

Response: [
  {
    "_id": "tool_id",
    "name": "John Deere Tractor",
    "category": "Tractor",
    "pricePerDay": 2000,
    "deposit": 10000,
    "images": ["/uploads/tools/image.jpg"],
    "available": true,
    "rating": 4.5,
    "reviewCount": 10
  }
]
```

#### Create Equipment (Owner only)
```http
POST /tools
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - name: string
  - description: string
  - category: string
  - pricePerDay: number
  - deposit: number
  - specifications: JSON string
  - images: File[] (max 5)

Response: { ...created_tool }
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tool": "tool_id",
  "startDate": "2024-04-20",
  "endDate": "2024-04-25"
}

Response: { ...created_booking }
```

#### Get User Bookings
```http
GET /bookings/my-bookings
Authorization: Bearer <token>

Response: [ ...bookings ]
```

#### Update Booking Status
```http
PATCH /bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}

Response: { ...updated_booking }
```

### Payment Endpoints

#### Create Deposit Order
```http
POST /payments/create-deposit-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id"
}

Response: {
  "orderId": "order_xxx",
  "amount": 10000,
  "keyId": "rzp_test_xxx"
}
```

#### Verify Deposit Payment
```http
POST /payments/verify-deposit-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}

Response: {
  "success": true,
  "message": "Deposit payment successful"
}
```

### Review Endpoints

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "tool": "tool_id",
  "booking": "booking_id",
  "rating": 5,
  "comment": "Excellent equipment!"
}

Response: { ...created_review }
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['farmer', 'owner', 'admin']),
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  upiId: String,
  paymentQR: String (base64),
  createdAt: Date,
  updatedAt: Date
}
```

### Tool Model
```javascript
{
  name: String (required),
  description: String (required),
  category: String (enum: ['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Other']),
  pricePerDay: Number (required),
  deposit: Number (required),
  images: [String],
  location: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  specifications: {
    brand: String,
    model: String,
    year: Number,
    condition: String (enum: ['Excellent', 'Good', 'Fair'])
  },
  available: Boolean (default: true),
  owner: ObjectId (ref: 'User'),
  rating: Number (default: 0),
  reviewCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: 'User'),
  tool: ObjectId (ref: 'Tool'),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number,
  totalAmount: Number,
  deposit: Number,
  status: String (enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled']),
  depositPaid: Boolean (default: false),
  rentPaid: Boolean (default: false),
  paymentStatus: String (enum: ['pending', 'deposit_paid', 'rent_paid']),
  remainingAmount: Number,
  cancelledBy: String (enum: ['farmer', 'owner']),
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  user: ObjectId (ref: 'User'),
  tool: ObjectId (ref: 'Tool'),
  booking: ObjectId (ref: 'Booking'),
  rating: Number (required, min: 1, max: 5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri_rental

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Email Service (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### Frontend (Optional)
Create `.env` in frontend folder:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🧪 Testing

### Manual Testing

1. **Authentication**
   - Register new user
   - Login with credentials
   - Access protected routes

2. **Equipment Management**
   - Create equipment (as owner)
   - Upload images
   - View equipment list
   - Filter by category/price

3. **Booking Flow**
   - Select equipment
   - Choose dates
   - Create booking
   - Owner approves
   - Pay deposit
   - Pay rent
   - Complete booking

4. **Payment Testing**
   - Use Razorpay test cards:
     - Success: 4111 1111 1111 1111
     - Failure: 4000 0000 0000 0002
   - CVV: Any 3 digits
   - Expiry: Any future date

5. **Email Testing**
   - Check console logs (development mode)
   - Check inbox (if EMAIL_USER configured)

### Utility Scripts

```bash
# View all database data
node scripts/view-data.js

# Change user role
node scripts/change-role.js

# Reset user password
node scripts/reset-password.js
```

---

## 📚 Additional Documentation

Detailed documentation available in `docs/` folder:

- **PROJECT_OVERVIEW.md** - Complete project overview and architecture
- **USER_GUIDE.md** - Step-by-step user manual for all roles
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **MONGODB_ATLAS_SETUP.md** - MongoDB Atlas cloud setup guide
- **PROJECT_STARTUP_GUIDE.md** - Detailed setup instructions
- **PRESENTATION_GUIDE.md** - Project presentation guide

---

## 🚨 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Kill process or change port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**3. Email Not Sending**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
Solution: Use Gmail App Password, not regular password
- Enable 2-Step Verification
- Generate App Password
- Use 16-character password in .env

**4. Razorpay Payment Fails**
```
Error: Key ID is required
```
Solution: Check Razorpay credentials in .env
- Use test keys for development
- Ensure no extra spaces in .env file

**5. Images Not Loading**
```
GET http://localhost:5000/uploads/tools/image.jpg 404
```
Solution: Check uploads folder exists
```bash
mkdir -p backend/uploads/tools
```

**6. Reverse Geocoding Rate Limit**
```
Error: Request failed with status code 429
```
Solution: Already handled with caching and queue system
- Wait a few seconds and refresh
- Cache will prevent repeated requests

---

## 🎨 Design & UI

### Color Scheme
- Primary: `#28a745` (Agricultural Green)
- Secondary: `#667eea` (Purple)
- Success: `#28a745`
- Danger: `#dc3545`
- Warning: `#ffc107`
- Info: `#17a2b8`

### Typography
- Font Family: System fonts (Arial, sans-serif)
- Headings: Bold, larger sizes
- Body: Regular weight, readable sizes

### Responsive Design
- Mobile-first approach
- Bootstrap 5 grid system
- Breakpoints: xs, sm, md, lg, xl

---

## 🤝 Contributing

This is an educational project. Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is created for educational purposes. Free to use and modify.

---

## 👥 Team

- **Developer**: Shrutika Patil
- **GitHub**: [@shrutika-patil76](https://github.com/shrutika-patil76)
- **Project**: AgriRent - Agricultural Equipment Rental System

---

## 🙏 Acknowledgments

- OpenStreetMap Nominatim for geocoding services
- Razorpay for payment gateway
- MongoDB Atlas for cloud database
- React and Node.js communities

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `docs/` folder
- Review troubleshooting section above

---

**Made with ❤️ for farmers and agricultural communities**

---

## 📊 Project Statistics

- **Total Files**: 100+
- **Lines of Code**: 10,000+
- **Components**: 15+
- **API Endpoints**: 30+
- **Database Models**: 4
- **External APIs**: 3
- **Development Time**: 3 months

---

*Last Updated: April 2026*
