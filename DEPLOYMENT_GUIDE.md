# Deployment Guide - Make Your App Accessible Online

## 🌐 Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - **RECOMMENDED**

This is the easiest and free option for deployment.

#### Step 1: Deploy Backend to Render.com

1. **Create GitHub Repository:**
   ```powershell
   cd "c:\xampp\htdocs\Expense Management System\expense-management-system"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub:**
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code

3. **Deploy on Render:**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `expense-manager-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       ```
       MONGO_URI=mongodb+srv://ram_db_user:pass12345@cluster0.i2lifk8.mongodb.net/ems?retryWrites=true&w=majority
       JWT_SECRET=your_super_secret_key_change_this
       PORT=5000
       ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://expense-manager-backend.onrender.com`)

#### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
     - **Environment Variables**:
       ```
       REACT_APP_API_BASE=https://expense-manager-backend.onrender.com/api
       ```
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Your app will be live at `https://your-app-name.vercel.app`

---

### Option 2: Railway.app (Full Stack) - **EASIEST**

Deploy both frontend and backend on Railway.

1. **Go to Railway:**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Deploy Backend:**
   - Railway auto-detects Node.js
   - Add environment variables:
     ```
     MONGO_URI=mongodb+srv://ram_db_user:pass12345@cluster0.i2lifk8.mongodb.net/ems?retryWrites=true&w=majority
     JWT_SECRET=your_secret_key
     PORT=5000
     ```
   - Set start command: `cd backend && npm start`
   - Get public URL

4. **Deploy Frontend:**
   - Add another service from same repo
   - Set environment variable:
     ```
     REACT_APP_API_BASE=<your-backend-url>/api
     ```
   - Set start command: `cd frontend && npm start`
   - Get public URL

---

### Option 3: Heroku (Traditional)

1. **Install Heroku CLI:**
   ```powershell
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login:**
   ```powershell
   heroku login
   ```

3. **Deploy Backend:**
   ```powershell
   cd backend
   git init
   heroku create expense-manager-backend
   heroku config:set MONGO_URI="mongodb+srv://ram_db_user:pass12345@cluster0.i2lifk8.mongodb.net/ems"
   heroku config:set JWT_SECRET="your_secret"
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

4. **Deploy Frontend:**
   ```powershell
   cd ../frontend
   git init
   heroku create expense-manager-frontend
   heroku config:set REACT_APP_API_BASE="https://expense-manager-backend.herokuapp.com/api"
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

---

## 🔧 Configuration Checklist

Before deploying, ensure:

- [ ] MongoDB Atlas is configured (not local MongoDB)
- [ ] `.env` files are NOT committed to Git (add to `.gitignore`)
- [ ] Environment variables are set in deployment platform
- [ ] CORS is configured for your frontend domain
- [ ] JWT_SECRET is strong and unique

---

## 📝 Post-Deployment Steps

### 1. Update CORS in Backend

Edit `backend/server.js`:

```javascript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-url.vercel.app', // Add your Vercel URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 2. Test Your Deployed App

1. Visit your frontend URL
2. Create admin account
3. Test all features:
   - User creation
   - Expense submission
   - OCR scanning
   - Approvals
   - Admin override

### 3. Share Access

Your app is now accessible at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`

Share the frontend URL with your team!

---

## 🔐 Test Credentials for Demo

After deployment, create these accounts for testing:

```
Admin:
Email: admin@testcorp.com
Password: admin123

Manager:
Email: manager@testcorp.com
Password: manager123

Employee:
Email: employee@testcorp.com
Password: employee123
```

---

## 💾 Database Access

Your MongoDB Atlas dashboard:
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Navigate to "Browse Collections"
4. View all data in real-time

---

## 🚀 Performance Tips

1. **Enable Caching:**
   - Add Redis for session management
   - Cache currency conversion rates

2. **Optimize Images:**
   - Compress receipt uploads
   - Use image CDN (Cloudinary)

3. **Add Monitoring:**
   - Use Sentry for error tracking
   - Add Google Analytics

4. **Security:**
   - Enable HTTPS (automatic on Vercel/Render)
   - Add rate limiting
   - Implement refresh tokens

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch auto-deploys
- Vercel/Render automatically rebuilds
- Zero downtime deployments

---

## 📊 Monitoring & Logs

### Render.com
- Go to your service dashboard
- Click "Logs" to see real-time logs
- Monitor CPU/Memory usage

### Vercel
- Go to your project
- Click "Deployments"
- View build logs and runtime logs

---

## 🆘 Troubleshooting Deployment

### Issue: Build Fails
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Review build logs for errors

### Issue: API Not Connecting
- Verify `REACT_APP_API_BASE` is correct
- Check CORS configuration
- Ensure backend is running

### Issue: Database Connection Error
- Verify MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- Check `MONGO_URI` format
- Ensure database user has correct permissions

---

## 📱 Mobile Access

Your deployed app is mobile-responsive!
- Access from any device
- Works on iOS/Android browsers
- Progressive Web App (PWA) ready

---

## 🎉 You're Live!

Your Expense Management System is now accessible worldwide at:
**https://your-app-name.vercel.app**

Share this URL with your team and start managing expenses!

---

## 📞 Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app

For app issues:
- Check `README.md`
- Review `TEST_CREDENTIALS.md`
- Check MongoDB Atlas logs
