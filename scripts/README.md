# 🛠️ Utility Scripts

This folder contains utility scripts for testing, debugging, and database management.

## 📊 Database Viewing

### view-data.js
View all data in the database with formatted output.

```bash
node scripts/view-data.js
```

Shows:
- All users (without passwords)
- All equipment with owner details
- All bookings with status
- All reviews with ratings

## 🔐 Password Management

### check-password.js
Verify user passwords and test bcrypt hashing.

```bash
node scripts/check-password.js
```

### reset-password.js
Reset a specific user's password.

```bash
node scripts/reset-password.js
```

### reset-all-passwords.js
Reset all user passwords to "password123".

```bash
node scripts/reset-all-passwords.js
```

### fix-passwords-final.js
Final password fix script with verification.

```bash
node scripts/fix-passwords-final.js
```

## 🧪 Testing Scripts

### test-login.js
Test login functionality with different credentials.

```bash
node scripts/test-login.js
```

### test-tools-api.js
Test equipment API endpoints.

```bash
node scripts/test-tools-api.js
```

### test-booking-approval.js
Test booking approval workflow.

```bash
node scripts/test-booking-approval.js
```

## 🐛 Debugging

### debug-login.js
Debug login issues with detailed logging.

```bash
node scripts/debug-login.js
```

### deep-debug.js
Deep debugging with password hash verification.

```bash
node scripts/deep-debug.js
```

## 🚜 Equipment Management

### add-equipment-example.js
Example script for adding equipment programmatically.

```bash
node scripts/add-equipment-example.js
```

### add-specifications.js
Add specifications to existing equipment.

```bash
node scripts/add-specifications.js
```

## 👤 User Management

### change-role.js
Change user role (farmer/owner/admin).

```bash
node scripts/change-role.js
```

---

## 📝 Notes

- All scripts require MongoDB to be running
- Scripts use the backend models and .env configuration
- Run from project root: `node scripts/script-name.js`
- Most scripts will exit automatically after completion

## ⚠️ Important

These are utility scripts for development and testing. Do not run in production without understanding what they do!

---

**Most Used Scripts:**
1. `view-data.js` - See what's in the database
2. `reset-all-passwords.js` - Reset all passwords for testing
3. `test-login.js` - Test login functionality
