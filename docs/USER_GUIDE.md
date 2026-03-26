# 📖 User Guide - Agricultural Equipment Rental System

## 🚀 Quick Start

### 1. Start the Application

**Option A: Use Batch File (Easiest)**
```bash
start-all.bat
```

**Option B: Manual Start**
```bash
# Terminal 1 - Start MongoDB (if not running)
# MongoDB should be at: D:\MongoDB\Server\8.0\bin\mongod.exe

# Terminal 2 - Start Backend
cd backend
npm start

# Terminal 3 - Start Frontend
cd frontend
npm start
```

### 2. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 3. Login with Test Accounts
```
Farmer: rajesh.kumar@gmail.com / password123
Owner: amit.singh@gmail.com / password123
Admin: admin@agrirent.com / password123
```

---

## 👨‍🌾 For Farmers

### Browse Equipment
1. Click "Browse Equipment" in navbar
2. Use filters: Category, Location, Price Range
3. Click on equipment to see details

### Book Equipment
1. View equipment details
2. Check "Already Booked Dates" to avoid conflicts
3. Select start and end dates
4. Review payment summary (Rent + Deposit)
5. Click "Book Now"
6. Wait for owner approval

### Track Bookings
1. Go to Dashboard
2. View "My Bookings" section
3. Status: Pending → Confirmed → Ongoing → Completed
4. Receive email when approved

### Write Reviews
1. After booking is completed
2. Go to equipment details page
3. Click "Write a Review"
4. Rate 1-5 stars and add comment

---

## 🚜 For Equipment Owners

### Add Equipment
1. Login as owner
2. Go to Dashboard
3. Click "Add New Equipment"
4. Fill in details:
   - Name, Description, Category
   - Price per day, Security deposit
   - Location
   - Specifications (Brand, Model, Year, Condition)
   - Upload images
5. Submit

### Manage Booking Requests
1. Go to Dashboard
2. View "Booking Requests" section
3. See pending requests with farmer details
4. Actions:
   - **Approve**: Confirms booking, sends email to farmer
   - **Reject**: Declines booking, sends cancellation email
   - **Start**: Mark as ongoing when equipment is picked up
   - **Complete**: Mark as completed when returned

### View Your Equipment
1. Dashboard shows all your listed equipment
2. Edit or delete equipment as needed
3. See booking history and reviews

---

## 👨‍💼 For Admins

### Access Admin Panel
1. Login with admin credentials
2. Click "Admin Panel" in navbar

### Manage Platform
- View all users
- Monitor all equipment
- Oversee all bookings
- Handle disputes

---

## 🔧 Troubleshooting

### Login Not Working
- Verify email and password
- Check MongoDB is running
- Test credentials: rajesh.kumar@gmail.com / password123

### MongoDB Connection Error
- Ensure MongoDB is running on port 27017
- Check backend/.env has correct MONGODB_URI

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Kill process on port 3000

### Equipment Not Showing
- Check if equipment is marked as available
- Verify owner has added equipment
- Run: `node scripts/view-data.js` to see database

### Booking Conflicts
- System automatically prevents double bookings
- Check "Already Booked Dates" before booking
- Dates must be in the future

---

## 📧 Email Notifications

When owner approves booking, farmer receives email with:
- Booking confirmation
- Equipment details
- Payment breakdown (Rent + Deposit)
- Booking dates
- Owner contact information

**Note**: In development mode, emails are logged to console.

---

## 🗄️ Database Management

### View All Data
```bash
node scripts/view-data.js
```

### Reset Database
```bash
cd database
node seed.js
```

This creates:
- 6 test users
- 13 equipment items
- 6 sample bookings
- 8 reviews

---

## 📱 Features Summary

✅ Multi-role authentication (Farmer/Owner/Admin)
✅ Equipment marketplace with filters
✅ Date-based booking with conflict prevention
✅ Booking approval workflow
✅ Email notifications
✅ Reviews and ratings
✅ Image uploads
✅ Responsive design
✅ Payment calculation (Rent + Deposit)

---

## 🎯 Booking Workflow

```
1. Farmer selects equipment and dates
2. System checks for conflicts
3. Booking created (Status: Pending)
4. Owner receives request
5. Owner approves/rejects
6. Email sent to farmer
7. Owner marks as Ongoing (equipment picked up)
8. Owner marks as Completed (equipment returned)
9. Farmer can write review
```

---

## 💡 Tips

- Always check booked dates before booking
- Deposit is refundable after equipment return
- Reviews help other farmers make decisions
- Keep equipment specifications updated
- Respond to booking requests promptly

---

**Need More Help?**
- Check database/schema.md for database structure
- See PROJECT_STATUS.md for project details
- Run scripts/view-data.js to inspect data
