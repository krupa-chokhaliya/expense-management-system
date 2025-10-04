# Quick Setup Guide

## ✅ What's Been Implemented

### Backend Features
- ✅ JWT Authentication (signup, login)
- ✅ Role-based access (Admin, Manager, Employee)
- ✅ Manager assignment to employees
- ✅ Multi-level approval workflow
- ✅ Conditional approval rules (percentage, specific, hybrid, sequential)
- ✅ Admin override capability
- ✅ OCR receipt parsing (Tesseract.js)
- ✅ Multi-currency support with real-time conversion
- ✅ Team expense viewing for managers
- ✅ File upload with Multer

### Frontend Features
- ✅ Role-based dashboards (Employee, Manager, Admin)
- ✅ OCR receipt scanning with progress indicator
- ✅ Expense submission form with auto-fill
- ✅ Approval workflow UI
- ✅ User management (Admin Panel)
- ✅ Approval rules configuration UI
- ✅ Manager assignment UI
- ✅ Currency conversion preview
- ✅ Responsive design (Tailwind CSS)

---

## 🚀 Quick Start (Already Connected to MongoDB Atlas)

Your MongoDB Atlas is already configured in `backend/.env`:

```
MONGO_URI=mongodb+srv://ram_db_user:pass12345@cluster0.i2lifk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Step 1: Install Backend Dependencies

```powershell
cd "c:\xampp\htdocs\Expense Management System\expense-management-system\backend"
npm install
```

**New dependency added**: `tesseract.js` for OCR

### Step 2: Start Backend

```powershell
npm run dev
```

✅ Backend should start on **http://localhost:5000**

### Step 3: Install Frontend Dependencies (New Terminal)

```powershell
cd "c:\xampp\htdocs\Expense Management System\expense-management-system\frontend"
npm install
```

**New dependency added**: `tesseract.js` for client-side OCR

### Step 4: Start Frontend

```powershell
npm start
```

✅ Frontend should open automatically on **http://localhost:3000**

---

## 📝 First Time Setup

### 1. Create Company & Admin User

1. Go to **http://localhost:3000/signup**
2. Fill in:
   - **Name**: Your name
   - **Email**: admin@company.com
   - **Password**: admin123
   - **Company Name**: Test Corp
   - **Base Currency**: USD
3. Click **Sign up**
4. You'll be logged in as **Admin**

### 2. Create Users (Admin Panel)

1. Go to **Admin** tab
2. In "Create User" section:
   - **Name**: John Manager
   - **Email**: manager@company.com
   - **Password**: manager123
   - **Role**: Manager
   - **Manager**: (leave empty for managers)
   - **Department**: Finance
3. Click **Create**

4. Create an Employee:
   - **Name**: Jane Employee
   - **Email**: employee@company.com
   - **Password**: employee123
   - **Role**: Employee
   - **Manager**: Select "John Manager"
   - **Department**: Sales
5. Click **Create**

### 3. Configure Approval Rules

1. In Admin Panel, scroll to "Approval Rules"
2. Check **"Require manager approval first"** (optional)
3. Click **"Add Rule"** to add approval steps:
   - **Step 1**: Select "John Manager", Rule Type: "Sequential"
   - **Step 2**: Select another approver, Rule Type: "Specific" (auto-approve if they approve)
4. Click **"Save Rules"**

---

## 🧪 Testing the System

### Test 1: Employee Submits Expense

1. **Logout** (if logged in as Admin)
2. **Login** as Employee:
   - Email: employee@company.com
   - Password: employee123
3. Go to **"Submit Expense"**
4. **Test OCR**:
   - Upload a receipt image (any image with text)
   - Wait for OCR to process (progress bar shows)
   - Fields auto-fill with extracted data
5. Fill remaining fields:
   - Amount: 50.00
   - Currency: USD
   - Category: Food & Dining
   - Date: Today
6. Click **"Submit Expense"**
7. ✅ Expense should appear in dashboard with status "Waiting Approval"

### Test 2: Manager Approves Expense

1. **Logout**
2. **Login** as Manager:
   - Email: manager@company.com
   - Password: manager123
3. Go to **"Approvals"** tab
4. See pending expense from Jane Employee
5. Click **"Approve"** or **"Reject"**
6. ✅ Expense status updates

### Test 3: Admin Override

1. **Logout**
2. **Login** as Admin
3. Go to **Admin Dashboard**
4. See all company expenses
5. For any "Waiting Approval" expense, click **"Override"**
6. ✅ Admin can force approve/reject

---

## 🎯 Key Features to Test

### OCR Receipt Scanning
- Upload clear receipt images (restaurant receipts work best)
- OCR extracts: Amount, Date, Category, Merchant
- Progress bar shows OCR processing status
- Fallback to manual entry if OCR fails

### Multi-Currency
- Submit expense in EUR, GBP, INR, etc.
- System converts to company base currency (USD)
- Both original and converted amounts stored
- Managers see amounts in base currency

### Approval Rules
- **Sequential**: All approvers must approve in order
- **Specific**: If CFO approves, auto-approve entire expense
- **Percentage**: If 60% approve, auto-approve
- **Hybrid**: 60% OR CFO approves

### Manager Assignment
- Employees assigned to managers
- Managers see team expenses in dashboard
- Manager approval can be required first

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check if MongoDB is connected
# Look for: "MongoDB connected: cluster0.i2lifk8.mongodb.net"
```

### Frontend won't start
```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### OCR not working
- Ensure `tesseract.js` is installed in both backend and frontend
- Try with clear, high-resolution images
- Check browser console for errors

### CORS errors
- Ensure backend is running on port 5000
- Frontend should be on port 3000
- CORS is already configured in backend

---

## 📊 Database Collections

Your MongoDB will have these collections:

- **users**: All users (Admin, Manager, Employee)
- **companies**: Company details and approval rules
- **expenses**: All expense records
- **approvals**: Approval workflow records
- **employees**: Employee-manager relationships (optional, merged into users)

---

## 🔐 Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | employee@company.com | employee123 |

---

## 📦 Dependencies Installed

### Backend
- express, mongoose, bcryptjs, jsonwebtoken
- multer (file upload)
- **tesseract.js** (OCR)
- axios (API calls)
- cors, morgan, dotenv

### Frontend
- react, react-dom, react-router-dom
- @tanstack/react-query (data fetching)
- react-hook-form, yup (forms)
- **tesseract.js** (OCR)
- axios (API client)
- tailwindcss (styling)

---

## ✨ Next Steps

1. Install dependencies (both backend and frontend)
2. Start both servers
3. Create test accounts
4. Test OCR with receipt images
5. Configure approval rules
6. Test approval workflow

**Everything is ready to run!** 🎉
