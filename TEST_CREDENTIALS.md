# Test Credentials & Testing Guide

## 🔐 Test User Accounts

After setting up the system, create these test accounts to test all features:

### 1. Admin User (First Signup)
```
Name: Admin User
Email: admin@testcorp.com
Password: admin123
Company Name: TestCorp
Base Currency: USD
Role: Admin (auto-assigned)
```

**Admin Capabilities:**
- ✅ Create and manage all users
- ✅ Configure approval rules
- ✅ View all company expenses
- ✅ Override any approval decision
- ✅ Assign managers to employees
- ✅ Set departments

---

### 2. Manager User
```
Name: John Manager
Email: manager@testcorp.com
Password: manager123
Role: Manager
Department: Finance
Manager: (none - managers don't have managers)
```

**Manager Capabilities:**
- ✅ Submit own expenses
- ✅ View team expenses (employees assigned to them)
- ✅ Approve/reject team member expenses
- ✅ View pending approvals
- ✅ Cannot access admin panel

---

### 3. Employee User
```
Name: Jane Employee
Email: employee@testcorp.com
Password: employee123
Role: Employee
Department: Sales
Manager: John Manager (select from dropdown)
```

**Employee Capabilities:**
- ✅ Submit expenses with OCR
- ✅ View own expense history
- ✅ Upload receipts
- ✅ Multi-currency support
- ✅ Cannot approve expenses
- ✅ Cannot access admin panel

---

## 📋 Complete Testing Workflow

### Step 1: Create Admin Account (First Time Setup)

1. Go to http://localhost:3000/signup
2. Fill in Admin details:
   - Name: `Admin User`
   - Email: `admin@testcorp.com`
   - Password: `admin123`
   - Company Name: `TestCorp`
   - Base Currency: `USD`
3. Click "Create Account"
4. You'll be logged in as Admin automatically

---

### Step 2: Create Manager (Admin Panel)

1. Navigate to **Admin** tab
2. In "Create User" section:
   - Name: `John Manager`
   - Email: `manager@testcorp.com`
   - Password: `manager123`
   - Role: `Manager`
   - Manager: (leave empty)
   - Department: `Finance`
3. Click **Create**

---

### Step 3: Create Employee (Admin Panel)

1. Still in Admin Panel
2. Create another user:
   - Name: `Jane Employee`
   - Email: `employee@testcorp.com`
   - Password: `employee123`
   - Role: `Employee`
   - Manager: Select `John Manager` from dropdown
   - Department: `Sales`
3. Click **Create**

---

### Step 4: Configure Approval Rules (Admin)

1. Scroll to "Approval Rules" section
2. **Option A - Simple Sequential Approval:**
   - Check ☑ "Require manager approval first"
   - Click "Add Rule"
   - Select `John Manager` as approver
   - Rule Type: `Sequential`
   - Click "Save Rules"

3. **Option B - Conditional Approval (Advanced):**
   - Check ☑ "Require manager approval first"
   - Click "Add Rule"
   - Select `Admin User` as approver
   - Rule Type: `Specific` (auto-approve if Admin approves)
   - Click "Add Rule" again
   - Select `John Manager`
   - Rule Type: `Percentage`
   - Threshold: `60`
   - Click "Save Rules"

---

### Step 5: Test Employee Workflow

1. **Logout** from Admin
2. **Login** as Employee:
   - Email: `employee@testcorp.com`
   - Password: `employee123`

3. **Submit Expense with OCR:**
   - Go to "Submit Expense"
   - Upload a receipt image (any image with text/numbers)
   - Wait for OCR to process (progress bar)
   - Review auto-filled fields:
     - Amount: (extracted or enter manually) `50.00`
     - Currency: `USD`
     - Category: (extracted or enter) `Food & Dining`
     - Date: Today's date
     - Description: (optional)
   - Click "Submit Expense"

4. **View Dashboard:**
   - See submitted expense in "My Expenses" table
   - Status should be "Waiting Approval"

---

### Step 6: Test Manager Workflow

1. **Logout** from Employee
2. **Login** as Manager:
   - Email: `manager@testcorp.com`
   - Password: `manager123`

3. **View Manager Dashboard:**
   - See "Pending Approvals" count
   - See "Team Expenses" showing Jane's expense

4. **Approve Expense:**
   - Go to "Approvals" tab
   - See Jane Employee's expense
   - Click "Approve" (or "Reject")
   - Optionally add comments
   - Expense moves to next step or finalizes

5. **Submit Own Expense:**
   - Managers can also submit expenses
   - Go to "Submit Expense"
   - Fill in details and submit

---

### Step 7: Test Admin Override

1. **Logout** from Manager
2. **Login** as Admin
3. Go to **Admin Dashboard**
4. See all company expenses
5. For any "Waiting Approval" expense:
   - Click "Override" button
   - Force approve or reject
   - All pending approvals marked as "Overridden"

---

## 🧪 Feature Testing Checklist

### Authentication ✅
- [ ] Signup creates company and admin
- [ ] Login works for all roles
- [ ] Logout clears session
- [ ] Token persists in localStorage

### Role-Based Access ✅
- [ ] Admin sees Admin Panel
- [ ] Manager sees Approvals tab
- [ ] Employee only sees Dashboard and Submit
- [ ] Dashboards show different content per role

### Expense Submission ✅
- [ ] OCR extracts data from receipt
- [ ] Multi-currency selection works
- [ ] Currency conversion displays
- [ ] File upload works
- [ ] Form validation works
- [ ] Expense appears in "My Expenses"

### Approval Workflow ✅
- [ ] Manager sees team member expenses
- [ ] Approval/rejection updates status
- [ ] Sequential approval moves to next step
- [ ] Specific approver auto-approves
- [ ] Percentage rule auto-approves at threshold
- [ ] Hybrid rule works (percentage OR specific)

### Manager Features ✅
- [ ] Manager can view team expenses
- [ ] Manager can approve/reject
- [ ] Manager can submit own expenses
- [ ] Team member assignment works

### Admin Features ✅
- [ ] Admin can create users
- [ ] Admin can assign managers
- [ ] Admin can set departments
- [ ] Admin can configure approval rules
- [ ] Admin can override approvals
- [ ] Admin sees all company expenses

### OCR Features ✅
- [ ] Upload receipt image
- [ ] OCR processes and extracts:
  - [ ] Amount
  - [ ] Date
  - [ ] Category hints
  - [ ] Merchant name
- [ ] Progress bar shows during processing
- [ ] Fallback to manual entry if OCR fails

### Currency Features ✅
- [ ] Currency list loads from API
- [ ] Conversion preview shows
- [ ] Both original and base amounts stored
- [ ] Managers see amounts in base currency

---

## 🌐 Accessing Online (Deployment)

To make this accessible online, you have several options:

### Option 1: Free Hosting (Recommended for Testing)

**Frontend (Vercel):**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Set build command: `cd frontend && npm run build`
5. Set output directory: `frontend/build`
6. Add environment variable: `REACT_APP_API_BASE=<your-backend-url>`

**Backend (Render.com):**
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables:
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-secret>`
   - `PORT=5000`

### Option 2: Heroku (Backend + Frontend)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create apps
heroku create testcorp-ems-backend
heroku create testcorp-ems-frontend

# Deploy backend
cd backend
git init
heroku git:remote -a testcorp-ems-backend
git add .
git commit -m "Deploy backend"
git push heroku main

# Deploy frontend
cd ../frontend
git init
heroku git:remote -a testcorp-ems-frontend
git add .
git commit -m "Deploy frontend"
git push heroku main
```

### Option 3: Railway.app (Easiest)

1. Go to https://railway.app
2. Connect GitHub repo
3. Railway auto-detects Node.js
4. Add environment variables
5. Get public URL

---

## 📊 Database Access (MongoDB Atlas)

Your current connection string:
```
mongodb+srv://ram_db_user:pass12345@cluster0.i2lifk8.mongodb.net/?retryWrites=true&w=majority
```

**View Data:**
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Navigate to your cluster
4. Click "Browse Collections"
5. See all data:
   - `users` - All user accounts
   - `companies` - Company details and approval rules
   - `expenses` - All expense records
   - `approvals` - Approval workflow records

---

## 🔍 Troubleshooting

### Issue: Can't login
- Check MongoDB is connected (backend logs)
- Verify email/password are correct
- Clear browser localStorage and try again

### Issue: OCR not working
- Ensure tesseract.js is installed
- Try with clear, high-resolution images
- Check browser console for errors
- Fallback: Enter data manually

### Issue: Approvals not showing
- Verify approval rules are configured
- Check user has Manager or Admin role
- Ensure expenses exist with "Waiting Approval" status

### Issue: Team expenses not showing (Manager)
- Verify employees are assigned to this manager
- Check employees have submitted expenses
- Refresh the page

---

## 📝 Quick Reference

| Feature | Admin | Manager | Employee |
|---------|-------|---------|----------|
| Submit Expenses | ✅ | ✅ | ✅ |
| View Own Expenses | ✅ | ✅ | ✅ |
| View Team Expenses | ✅ | ✅ | ❌ |
| View All Expenses | ✅ | ❌ | ❌ |
| Approve/Reject | ✅ | ✅ | ❌ |
| Admin Override | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Configure Rules | ✅ | ❌ | ❌ |
| OCR Scanning | ✅ | ✅ | ✅ |
| Multi-Currency | ✅ | ✅ | ✅ |

---

## 🎯 Success Criteria

Your system is working correctly if:

1. ✅ All three user types can login
2. ✅ Employee can submit expense with OCR
3. ✅ Manager sees employee's expense in team view
4. ✅ Manager can approve expense
5. ✅ Expense status updates to "Approved"
6. ✅ Admin can see all expenses
7. ✅ Admin can override any approval
8. ✅ Currency conversion works
9. ✅ Approval rules are enforced

---

**Need Help?** Check the main README.md or SETUP_GUIDE.md for detailed documentation.
