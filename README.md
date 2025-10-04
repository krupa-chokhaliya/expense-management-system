# Expense Management System (EMS)

Full-stack web application with **multi-level approvals**, **OCR receipt parsing** (Tesseract.js), **currency conversion**, **role-based access**, and **conditional approval rules**.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Tesseract.js
- **Frontend**: React 18, Tailwind CSS, React Router v6, React Query, react-hook-form + yup, Tesseract.js
- **Auth**: JWT-based authentication

## Project Structure

```
expense-management-system/
├── backend/                  # Node.js + Express API
│   ├── config/              # Database connection
│   ├── controllers/         # Business logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & role middleware
│   ├── utils/               # OCR, currency helpers
│   └── server.js
└── frontend/                # React SPA
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Route pages (role-based dashboards)
    │   ├── services/        # API client & services
    │   ├── context/         # Auth & React Query providers
    │   ├── hooks/           # Custom hooks
    │   └── utils/           # Helpers
    └── public/
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or cloud - MongoDB Atlas recommended)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

Start backend:

```bash
npm run dev
```

Backend runs on: **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Optional `frontend/.env`:

```env
REACT_APP_API_BASE=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

Frontend runs on: **http://localhost:3000**

---

## Core Features

### 1. **Authentication & User Management**
- First signup auto-creates company with base currency
- First user becomes **Admin**
- Roles: **Admin**, **Manager**, **Employee**
- Admin can create users, assign managers, and set departments

### 2. **Role-Based Dashboards**
- **Employee Dashboard**: Submit expenses, view personal expense history
- **Manager Dashboard**: View team expenses, approve/reject team claims, submit own expenses
- **Admin Dashboard**: Company-wide analytics, user management, approval rule configuration

### 3. **Expense Submission**
- Multi-currency support with real-time conversion to company base currency
- **OCR Receipt Scanning**: Upload receipt image → auto-extract amount, date, category, merchant
- Fields: Amount, Currency, Category, Description, Date, Receipt Upload
- Both original and converted amounts stored

### 4. **Multi-Level Approval Workflow**
- **Sequential Approvals**: Define step-by-step approval chain (Manager → Finance → Director)
- **Manager as First Approver**: Optional checkbox to require employee's assigned manager approval first
- **Conditional Rules**:
  - **Specific Approver**: Auto-approve if specific person (e.g., CFO) approves
  - **Percentage Rule**: Approve if X% of approvers approve
  - **Hybrid Rule**: Percentage OR specific approver
  - **Sequential Rule**: All approvers must approve in order

### 5. **Manager Assignment**
- Employees can be assigned to managers
- Managers view team expenses in dedicated dashboard
- Manager approval can be required as first step in workflow

### 6. **Admin Override**
- Admin can override any approval decision
- Force approve or reject any expense
- All pending approvals marked as "Overridden"

### 7. **Currency Management**
- Fetches live currency list from restcountries.com API
- Real-time conversion using exchangerate-api.com
- Displays both original and base currency amounts
- Managers/Admins always see amounts in company base currency

### 8. **OCR Receipt Parsing**
- **Frontend**: Tesseract.js processes images in browser
- **Backend**: Tesseract.js processes uploaded receipts
- Auto-extracts: Amount, Date, Merchant, Category hints
- Progress indicator during OCR processing
- Fallback to manual entry if OCR fails

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create company & admin user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - List all company users
- `POST /api/users` - Create user (with manager assignment)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Expenses
- `POST /api/expenses` - Submit expense (multipart/form-data)
- `GET /api/expenses/me` - My expenses (paginated)
- `GET /api/expenses/team` - Team expenses (Manager only)
- `GET /api/expenses/company` - All company expenses (Admin only)

### Approvals
- `GET /api/approvals/my` - My pending approvals
- `POST /api/approvals/:approvalId/action` - Approve/Reject
- `POST /api/approvals/override/:expenseId` - Admin override

### Company
- `GET /api/company` - Get company details & approval rules
- `PUT /api/company/approval-rules` - Update approval rules (Admin only)

---

## Approval Rules Configuration

Admins can configure complex approval workflows:

1. **Manager Approval First** (checkbox)
   - If enabled, employee's assigned manager must approve first
   - Auto-skipped if employee has no manager

2. **Multi-Step Approvers**
   - Add multiple approval steps with sequence order
   - Each step has:
     - **Approver**: Specific Manager/Admin
     - **Rule Type**: Specific, Percentage, Hybrid, Sequential
     - **Threshold %**: For percentage-based rules

3. **Rule Types**:
   - **Specific**: If this person approves, auto-approve entire expense
   - **Percentage**: If X% of all approvers approve, auto-approve
   - **Hybrid**: Percentage threshold OR specific approver
   - **Sequential**: All must approve in order (default)

---

## User Workflows

### Employee Workflow
1. Login → Employee Dashboard
2. Click "Submit Expense"
3. Upload receipt image → OCR auto-fills fields
4. Review/edit auto-filled data
5. Submit → Status: "Waiting Approval"
6. View expense history in dashboard

### Manager Workflow
1. Login → Manager Dashboard
2. View team expenses
3. Go to "Approvals" tab
4. Review pending expense (see amount in base currency)
5. Approve or Reject with optional comments
6. Expense moves to next approval step or finalizes

### Admin Workflow
1. Login → Admin Dashboard
2. **Manage Users**:
   - Create employees/managers
   - Assign managers to employees
   - Set departments
3. **Configure Approval Rules**:
   - Enable manager approval
   - Add multi-step approvers
   - Set conditional rules
4. **Override Approvals**:
   - Force approve/reject any expense
5. View company-wide analytics

---

## Security Features

- JWT tokens with 7-day expiration
- Password hashing with bcrypt (10 rounds)
- Role-based middleware protection
- CORS enabled
- File upload validation (Multer)
- MongoDB injection protection (Mongoose)

---

## Production Deployment

### Backend
1. Set strong `JWT_SECRET` in production
2. Use MongoDB Atlas or managed MongoDB
3. Configure CORS for production domain
4. Use PM2 or similar process manager
5. Set up HTTPS/SSL
6. Configure file storage (AWS S3, Cloudinary)

### Frontend
1. Build: `npm run build`
2. Serve static files via Nginx/Apache
3. Set `REACT_APP_API_BASE` to production API URL
4. Enable gzip compression
5. Configure CDN for assets

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running (local) or Atlas cluster is active
- Check `MONGO_URI` format and credentials
- Whitelist IP in MongoDB Atlas Network Access

### OCR Not Working
- Ensure Tesseract.js is installed: `npm install tesseract.js`
- Check browser console for errors
- Try with clear, high-resolution receipt images
- Fallback: Manual entry always available

### CORS Errors
- Backend CORS is enabled for all origins in development
- In production, configure specific allowed origins

---

## Future Enhancements

- Email notifications for approvals
- Expense reports & analytics dashboard
- Bulk expense upload (CSV/Excel)
- Mobile app (React Native)
- Integration with accounting software (QuickBooks, Xero)
- Expense categories management
- Budget limits & alerts

---

## License

MIT

---

## Support

For issues or questions, please create an issue in the repository.
