# 🚜 Smart Agricultural Equipment Rental System

A full-stack web application for renting agricultural equipment - Think Amazon + OLX for farmers!

## 🎯 Features

### For Farmers
- Browse equipment with advanced filters (category, location, price)
- View detailed equipment specifications and reviews
- Check real-time availability and booked dates
- Book equipment with automatic conflict prevention
- Track booking status (Pending → Confirmed → Ongoing → Completed)
- Write reviews after equipment usage

### For Tool Owners
- List equipment with images and specifications
- Manage booking requests (Approve/Reject)
- Track equipment status and earnings
- View customer reviews
- Receive email notifications on bookings

### For Admins
- Manage all users and equipment
- Monitor platform activity
- Handle disputes and issues

### Technical Features
- JWT-based authentication
- Image upload with Multer
- Email notifications (Nodemailer)
- Date conflict validation
- Responsive design (mobile-friendly)
- RESTful API architecture

## 🛠️ Tech Stack

- **Frontend**: React.js, Bootstrap 5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Tools**: Postman, Git

## 📦 Project Structure

```
project/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/     # All page components
│   │   ├── components/# Reusable components
│   │   └── context/   # Auth context
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── utils/         # Email service
│   ├── uploads/       # Image uploads
│   └── server.js
├── database/          # Database setup
│   ├── seed.js        # Production seeding
│   ├── schema.md      # Database schema
│   └── package.json
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── assets/            # Static resources
├── start-all.bat      # Quick start script
└── README.md
```

## 🚀 Quick Start

### Option 1: Use Batch File (Windows)
```bash
start-all.bat
```

### Option 2: Manual Setup

1. **Start MongoDB**
```bash
# Make sure MongoDB is running on port 27017
```

2. **Backend Setup**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

4. **Seed Database** (First time only)
```bash
cd database
npm install
node seed.js
```

## 🔑 Test Credentials

After seeding, login with:
- **Farmer**: rajesh.kumar@gmail.com / password123
- **Owner**: amit.singh@gmail.com / password123
- **Admin**: admin@agrirent.com / password123

## 👥 User Roles

1. **Farmer** - Browse & rent equipment
2. **Tool Owner** - List & manage equipment
3. **Admin** - Manage platform

## 📱 Pages

- **Home Page** - Landing page with featured equipment
- **Login/Register** - User authentication
- **Browse Equipment** - Marketplace with filters
- **Equipment Details** - Detailed view with booking
- **Dashboard** - Role-based user dashboard
- **Admin Panel** - Platform management

## 🔄 Booking Workflow

1. Farmer browses equipment and selects dates
2. System checks for date conflicts
3. Booking request sent to owner (Status: Pending)
4. Owner approves/rejects request
5. Email notification sent to farmer
6. Owner marks as Ongoing when equipment is picked up
7. Owner marks as Completed when returned
8. Farmer can write a review

## 📧 Email Notifications

- Booking confirmation with payment details
- Booking rejection notification
- Owner contact information included
- Development mode: Console logging
- Production: Configure EMAIL_USER and EMAIL_PASS in .env

## 🗂️ Database Schema

- **Users**: Authentication and profile data
- **Tools**: Equipment listings with specifications
- **Bookings**: Rental transactions and status
- **Reviews**: Ratings and comments

See `database/schema.md` for detailed schema documentation.

## 📚 Documentation

Essential documentation in the `docs/` folder:
- **PROJECT_OVERVIEW.md** - Complete project overview
- **USER_GUIDE.md** - User manual for all roles
- **API_DOCUMENTATION.md** - Complete API reference
- **PRESENTATION_GUIDE.md** - Presentation guide

## 🛠️ Utility Scripts

14 utility scripts in `scripts/` folder:
- **view-data.js** - View all database data
- **test-*.js** - Testing scripts
- **reset-*.js** - Password management
- See `scripts/README.md` for complete list

## 🎨 Design Theme

Agricultural green theme with modern, clean UI
- Primary Color: #28a745 (Green)
- Clean card-based layouts
- Responsive Bootstrap 5 components
- Professional typography

## 🔧 Environment Variables

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/agri_rental
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Tools
- GET `/api/tools` - Get all equipment
- GET `/api/tools/:id` - Get equipment details
- POST `/api/tools` - Create equipment (Owner only)
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

See `docs/API_DOCUMENTATION.md` for complete API documentation.

## 🚨 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on port 27017
- Check MONGODB_URI in backend/.env

### Login Issues
- Verify user exists in database
- Check password is "password123" for test users
- Run `node scripts/view-data.js` to see all users

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/package.json

## 🤝 Contributing

This is a college project. Feel free to fork and enhance!

## 📄 License

Educational project - Free to use and modify

---
Made with ❤️ for farmers
