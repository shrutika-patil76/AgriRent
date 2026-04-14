# AgriRent Project - Startup Guide

**Date:** April 13, 2026  
**Status:** ✅ **PROJECT RUNNING**

---

## 🚀 Project Started Successfully

### Server Status

#### Backend Server
- **Status:** ✅ Running
- **Port:** 5000
- **URL:** http://localhost:5000
- **Database:** ✅ MongoDB Connected
- **Razorpay:** ✅ Initialized
- **Features:**
  - ✅ Authentication API
  - ✅ Tools Management API
  - ✅ Bookings API
  - ✅ Payments API (Razorpay)
  - ✅ Reviews API
  - ✅ Email Service

#### Frontend Server
- **Status:** ✅ Running
- **Port:** 3000
- **URL:** http://localhost:3000
- **Framework:** React
- **Features:**
  - ✅ User Authentication
  - ✅ Equipment Listing
  - ✅ Booking Management
  - ✅ Payment Integration
  - ✅ Dashboard
  - ✅ Profile Management

---

## 📱 Access the Application

### Frontend
```
URL: http://localhost:3000
```

### Backend API
```
URL: http://localhost:5000/api
```

---

## 👤 Test Credentials

### Farmer Account
```
Email: rajesh.kumar@gmail.com
Password: password123
Role: Farmer (Rent Equipment)
```

### Tool Owner Account
```
Email: amit.singh@gmail.com
Password: password123
Role: Owner (List Equipment)
UPI ID: amit.singh@upi
Payment QR: ✅ Configured
```

### Admin Account
```
Email: admin@agrirent.com
Password: password123
Role: Admin
```

---

## 🔑 Key Features Implemented

### 1. User Authentication
- ✅ Signup with role selection
- ✅ UPI QR upload for tool owners
- ✅ Login with JWT tokens
- ✅ Profile management

### 2. Equipment Management
- ✅ List equipment by category
- ✅ View equipment details
- ✅ Search and filter
- ✅ Equipment images
- ✅ Specifications

### 3. Booking System
- ✅ Create bookings
- ✅ Owner approval/rejection
- ✅ Booking status tracking
- ✅ Cancellation with tracking
- ✅ Email notifications

### 4. Payment System (Two-Stage)
- ✅ Deposit payment (Stage 1)
- ✅ Rent payment (Stage 2)
- ✅ Razorpay integration
- ✅ Payment QR in emails
- ✅ Payment status tracking

### 5. Email Notifications
- ✅ Booking confirmation with QR
- ✅ Booking rejection
- ✅ Cancellation notifications
- ✅ Payment confirmations

### 6. Dashboard
- ✅ Farmer bookings view
- ✅ Owner booking requests
- ✅ Equipment management
- ✅ Payment buttons
- ✅ Status tracking

---

## 🧪 Testing the Application

### Test Workflow

#### 1. Farmer Signup
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Select "Farmer (Rent Equipment)"
4. Fill in details
5. Click "Sign Up"

#### 2. Owner Signup
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Select "Equipment Owner (List Equipment)"
4. Fill in details
5. **Upload UPI QR code** (Required)
6. Enter UPI ID (e.g., name@upi)
7. Click "Sign Up"

#### 3. Create Booking (as Farmer)
1. Login as farmer
2. Go to "Equipment Listing"
3. Select equipment
4. Click "Book Now"
5. Select dates
6. Click "Confirm Booking"

#### 4. Approve Booking (as Owner)
1. Login as owner
2. Go to "Dashboard"
3. View "Booking Requests"
4. Click "Approve"
5. **Email sent to farmer with payment QR** ✅

#### 5. Pay Deposit (as Farmer)
1. Login as farmer
2. Go to "Dashboard"
3. Find confirmed booking
4. Click "Pay Deposit"
5. Complete Razorpay payment
6. Deposit marked as paid ✅

#### 6. Pay Rent (as Farmer)
1. After deposit paid
2. Click "Pay Rent"
3. Complete Razorpay payment
4. Rent marked as paid ✅

---

## 📊 Database

### MongoDB Connection
- **Status:** ✅ Connected
- **Database:** agri_rental
- **Collections:**
  - users (7 test users)
  - tools (12 equipment items)
  - bookings (5 test bookings)
  - reviews (8 test reviews)

### Test Data
- ✅ 7 users (farmers, owners, admin)
- ✅ 12 equipment items
- ✅ 5 bookings with various statuses
- ✅ 8 reviews

---

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
PATCH  /api/auth/update-payment-qr - Update payment QR (owner)
```

### Equipment
```
GET    /api/tools                  - List all equipment
GET    /api/tools/:id              - Get equipment details
POST   /api/tools                  - Create equipment (owner)
PATCH  /api/tools/:id              - Update equipment (owner)
DELETE /api/tools/:id              - Delete equipment (owner)
```

### Bookings
```
POST   /api/bookings               - Create booking
GET    /api/bookings/my-bookings   - Get farmer bookings
GET    /api/bookings/owner-bookings - Get owner bookings
PATCH  /api/bookings/:id/status    - Update booking status
```

### Payments
```
POST   /api/payments/create-deposit-order    - Create deposit order
POST   /api/payments/verify-deposit-payment  - Verify deposit
POST   /api/payments/create-rent-order       - Create rent order
POST   /api/payments/verify-rent-payment     - Verify rent
GET    /api/payments/:bookingId/status       - Get payment status
```

### Reviews
```
POST   /api/reviews                - Create review
GET    /api/reviews/tool/:toolId   - Get tool reviews
```

---

## 📧 Email Service

### Development Mode
- Emails logged to console
- No actual email sending
- Shows full email content

### Production Mode
- Configure Gmail SMTP
- Set EMAIL_USER and EMAIL_PASS in .env
- Emails sent to real addresses

### Email Types
1. **Booking Confirmation** - Includes payment QR
2. **Booking Rejection** - Owner rejected booking
3. **Farmer Cancellation** - Farmer cancelled booking
4. **Cancellation Confirmation** - Confirms cancellation

---

## 🛠️ Troubleshooting

### Backend Not Starting
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID {PID} /F

# Restart backend
npm start (in backend folder)
```

### Frontend Not Starting
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start frontend
npm start (in frontend folder)
```

### MongoDB Connection Error
```
Check:
1. MongoDB Atlas connection string in .env
2. Network access in MongoDB Atlas
3. Database user credentials
4. IP whitelist
```

### Payment Not Working
```
Check:
1. Razorpay credentials in .env
2. Test mode enabled in Razorpay
3. Browser console for errors
4. Backend logs for payment errors
```

---

## 📝 Important Notes

### Payment System
- ✅ Two-stage payment (deposit + rent)
- ✅ Deposit must be paid before rent
- ✅ Payment QR sent via email
- ✅ Mock Razorpay for testing
- ⚠️ Use real credentials for production

### Email Service
- ✅ Logs to console in development
- ✅ Includes payment QR in confirmation
- ✅ Tracks who cancelled booking
- ⚠️ Configure real SMTP for production

### Security
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ User ownership verification
- ✅ Payment verification
- ⚠️ Enable HTTPS in production

---

## 🚀 Next Steps

1. **Test the Application**
   - Create accounts
   - List equipment
   - Create bookings
   - Test payments

2. **Configure Production**
   - Update Razorpay credentials
   - Configure email service
   - Enable HTTPS
   - Set up database backups

3. **Deploy**
   - Deploy backend to server
   - Deploy frontend to CDN
   - Configure domain
   - Set up monitoring

---

## 📞 Support

### Common Issues

**Q: QR code not showing in email?**
A: Check backend logs. Owner must have paymentQR uploaded during signup.

**Q: Payment not working?**
A: Check Razorpay credentials in .env. Use test mode for development.

**Q: Booking not showing?**
A: Refresh page. Check booking status in database.

**Q: Email not sending?**
A: Check backend logs. In development, emails are logged to console.

---

## ✅ Verification Checklist

- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected
- ✅ Test data seeded
- ✅ Authentication working
- ✅ Equipment listing working
- ✅ Booking system working
- ✅ Payment system working
- ✅ Email service working
- ✅ QR code in emails

---

**Project Status:** ✅ **READY FOR TESTING**

**Last Updated:** April 13, 2026  
**Version:** 1.0.0
