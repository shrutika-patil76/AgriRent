# 🚜 Agricultural Equipment Rental System - Project Overview

## 📋 Project Summary

A full-stack MERN (MongoDB, Express, React, Node.js) web application that connects farmers with agricultural equipment owners, enabling easy rental of farming machinery. Think of it as "Amazon + OLX for farmers."

**Project Type:** College Web Technology Project  
**Status:** ✅ Complete & Production Ready  
**Last Updated:** March 27, 2026

---

## 🎯 Problem Statement

Farmers often need expensive agricultural equipment for short periods but cannot afford to purchase them. Equipment owners have idle machinery that could generate income. This platform bridges that gap.

---

## ✨ Key Features

### For Farmers 👨‍🌾
- Browse equipment with advanced filters (category, location, price)
- View detailed specifications and reviews
- Check real-time availability and booked dates
- Book equipment with automatic conflict prevention
- Track booking status (Pending → Confirmed → Ongoing → Completed)
- Write reviews after usage

### For Equipment Owners 🚜
- List equipment with images and specifications
- Manage booking requests (Approve/Reject)
- Track equipment status and earnings
- Receive email notifications
- View customer reviews

### For Admins 👨‍💼
- Manage all users and equipment
- Monitor platform activity
- View statistics and analytics

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Bootstrap 5** - Styling framework
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email notifications

### Tools
- **Git** - Version control
- **Postman** - API testing
- **MongoDB Compass** - Database GUI

---

## 📊 Database Schema

### Collections

**Users**
- name, email, password (hashed), role (farmer/owner/admin)
- phone, address, createdAt

**Tools (Equipment)**
- name, description, category, pricePerDay, deposit
- images[], location, available, rating, reviewCount
- specifications (brand, model, year, condition)
- owner (ref: User)

**Bookings**
- user (ref: User), tool (ref: Tool)
- startDate, endDate, totalDays, totalAmount, deposit
- status (pending/confirmed/ongoing/completed/cancelled)
- paymentStatus

**Reviews**
- user (ref: User), tool (ref: Tool)
- rating (1-5), comment, createdAt

---

## 🔄 System Workflow

### Booking Process
```
1. Farmer browses equipment
2. Selects dates and creates booking (Status: Pending)
3. System checks for date conflicts
4. Owner receives booking request
5. Owner approves/rejects
6. Email notification sent to farmer
7. Owner marks as Ongoing (equipment picked up)
8. Owner marks as Completed (equipment returned)
9. Farmer writes review
```

### Authentication Flow
```
1. User registers/logs in
2. Server validates credentials
3. JWT token generated and returned
4. Token stored in localStorage
5. Token sent with each API request
6. Middleware verifies token
7. Access granted to protected routes
```

---

## 📁 Project Structure

```
project/
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # 7 page components
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Auth context
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json
│
├── backend/              # Node.js + Express API
│   ├── models/          # 4 Mongoose models
│   ├── routes/          # 5 route files
│   ├── middleware/      # JWT auth middleware
│   ├── utils/           # Email service
│   ├── uploads/         # Image storage
│   ├── server.js        # Server entry point
│   └── .env             # Environment variables
│
├── database/            # Database setup
│   ├── seed.js         # Production seeding script
│   ├── schema.md       # Database documentation
│   └── package.json
│
├── docs/               # Documentation (6 files)
│   ├── USER_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── PROJECT_OVERVIEW.md (this file)
│   ├── FEATURES.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── PRESENTATION_GUIDE.md
│
├── scripts/            # Utility scripts (13 files)
│   ├── view-data.js
│   ├── test-*.js
│   └── README.md
│
├── README.md           # Main readme
├── PROJECT_STATUS.md   # Current status
└── start-all.bat       # Quick start script
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running on port 27017)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone <repo-url>

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Install database dependencies
cd ../database
npm install

# 5. Seed database
node seed.js

# 6. Start application
# Use start-all.bat or manually start:
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm start
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017/agri_rental

### Test Credentials
```
Farmer: rajesh.kumar@gmail.com / password123
Owner: amit.singh@gmail.com / password123
Admin: admin@agrirent.com / password123
```

---

## 📈 Project Statistics

- **Total Files:** 100+
- **Lines of Code:** ~5,000+
- **API Endpoints:** 15+
- **React Components:** 10+
- **Database Models:** 4
- **Test Users:** 6
- **Sample Equipment:** 13
- **Sample Bookings:** 6
- **Sample Reviews:** 8

---

## 🎨 Design Highlights

### Color Scheme
- Primary Green: #28a745 (Agricultural theme)
- Secondary: #218838
- Background: #f8f9fa
- Text: #333

### UI Features
- Responsive design (mobile-friendly)
- Card-based layouts
- Smooth animations
- Professional typography (Poppins font)
- Bootstrap 5 components
- Clean and modern interface

---

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication
- Protected API routes
- Role-based access control
- Input validation
- CORS enabled
- Secure HTTP headers

---

## 📧 Email Notifications

When a booking is approved:
- Confirmation email sent to farmer
- Includes booking details
- Payment breakdown (Rent + Deposit)
- Owner contact information
- Booking dates and equipment info

**Note:** Currently in development mode (console logging). Configure EMAIL_USER and EMAIL_PASS in .env for production.

---

## 🧪 Testing

### Manual Testing Completed
✅ User registration and login  
✅ Equipment browsing and filtering  
✅ Equipment details and specifications  
✅ Booking creation with date validation  
✅ Date conflict prevention  
✅ Booking approval workflow  
✅ Email notifications  
✅ Review submission  
✅ Image uploads  
✅ Dashboard functionality  
✅ Admin panel features  

### Test Data
- 6 users (2 farmers, 3 owners, 1 admin)
- 13 equipment items across 6 categories
- 6 bookings in various states
- 8 reviews with ratings

---

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- Full-stack MERN development
- RESTful API design and implementation
- Database design and relationships
- Authentication and authorization
- File upload handling
- Email integration
- Date/time management
- Responsive UI design
- State management
- Project organization and documentation

---

## 🚀 Future Enhancements (Optional)

- Payment gateway integration (Razorpay/Stripe)
- Real-time chat between users
- GPS-based location tracking
- Mobile app (React Native)
- Advanced analytics dashboard
- Multi-language support
- SMS notifications
- Equipment maintenance tracking
- AI-based recommendations
- Weather API integration

---

## 📝 API Endpoints Summary

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Equipment
- GET `/api/tools` - Get all equipment
- GET `/api/tools/:id` - Get equipment details
- POST `/api/tools` - Create equipment (Owner)
- PUT `/api/tools/:id` - Update equipment
- DELETE `/api/tools/:id` - Delete equipment

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/user` - Get user bookings
- GET `/api/bookings/owner-bookings` - Get owner bookings
- GET `/api/bookings/tool/:toolId/booked-dates` - Get booked dates
- PUT `/api/bookings/:id/status` - Update booking status

### Reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/tool/:toolId` - Get tool reviews

See `docs/API_DOCUMENTATION.md` for complete details.

---

## 🎤 Presentation Tips

1. **Demo Flow:**
   - Start with homepage
   - Show farmer journey (browse → book)
   - Show owner journey (approve → manage)
   - Show admin panel

2. **Highlight Features:**
   - Date conflict prevention
   - Email notifications
   - Review system
   - Responsive design

3. **Technical Discussion:**
   - MERN stack architecture
   - JWT authentication
   - Database relationships
   - API design

See `docs/PRESENTATION_GUIDE.md` for detailed presentation guide.

---

## 📞 Support & Documentation

- **User Guide:** `docs/USER_GUIDE.md`
- **API Docs:** `docs/API_DOCUMENTATION.md`
- **Features:** `docs/FEATURES.md`
- **Architecture:** `docs/SYSTEM_ARCHITECTURE.md`
- **Database Schema:** `database/schema.md`
- **Scripts:** `scripts/README.md`

---

## 👥 Team & Credits

**Developed by:** [Your Name/Team Name]  
**Course:** Web Technology  
**Institution:** [Your College Name]  
**Year:** 2026

---

## 📄 License

Educational project - Free to use and modify

---

**Project Status:** ✅ COMPLETE & READY FOR DEMONSTRATION
