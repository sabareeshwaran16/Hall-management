# Deployment Guide - Exam Hall Allocation System

## 🚀 Deployment Options

### Option 1: Free Hosting (Recommended for Demo)
- **Backend**: Render (Free tier)
- **Frontend**: Vercel (Free tier)
- **Database**: MongoDB Atlas (Free tier)

### Option 2: AWS
- **Backend**: EC2 or Elastic Beanstalk
- **Frontend**: S3 + CloudFront
- **Database**: MongoDB Atlas or DocumentDB

### Option 3: Heroku
- **Full Stack**: Heroku (Backend + Frontend)
- **Database**: MongoDB Atlas

---

## 📦 Option 1: Free Deployment (Render + Vercel + MongoDB Atlas)

### Step 1: Setup MongoDB Atlas (Database)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/exam_hall_allocation?retryWrites=true&w=majority`

---

### Step 2: Deploy Backend to Render

1. **Push Code to GitHub** (if not done)
   ```bash
   cd c:\Users\Sabareeshwaran\OneDrive\Desktop\mp\HALLALLOCATION
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select "Hall-management" repository

4. **Configure Service**
   - **Name**: `exam-hall-backend`
   - **Region**: Choose closest region
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/exam_hall_allocation?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
   
   **Note**: You'll update FRONTEND_URL after deploying frontend

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://exam-hall-backend.onrender.com`

7. **Seed Initial Data**
   - Once deployed, run seed scripts via Render Shell:
   - Go to your service → "Shell" tab
   - Run:
   ```bash
   cd backend
   node seedAdmin.js
   node seedDepartments.js
   node seedFaculty.js
   ```

---

### Step 3: Deploy Frontend to Vercel

1. **Update Frontend API URL**
   
   Create `.env` file in frontend folder:
   ```bash
   cd frontend
   ```
   
   Create file: `frontend/.env`
   ```
   REACT_APP_API_URL=https://exam-hall-backend.onrender.com/api
   ```

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add production API URL"
   git push origin main
   ```

3. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

4. **Import Project**
   - Click "Add New" → "Project"
   - Import "Hall-management" repository
   - Click "Import"

5. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

6. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
   ```
   REACT_APP_API_URL=https://exam-hall-backend.onrender.com/api
   ```

7. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your frontend URL: `https://your-app-name.vercel.app`

8. **Update Backend FRONTEND_URL**
   - Go back to Render dashboard
   - Open your backend service
   - Go to "Environment"
   - Update `FRONTEND_URL` to your Vercel URL
   - Click "Save Changes"
   - Service will redeploy automatically

---

### Step 4: Test Deployment

1. **Open Frontend URL**
   - Go to `https://your-app-name.vercel.app`

2. **Login with Default Credentials**
   - Admin: `admin@college.edu` / `admin123`
   - Faculty: `faculty@college.edu` / `faculty123`

3. **Test Features**
   - Create departments
   - Create halls
   - Upload students
   - Create exam
   - Allocate seats

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- Check Render logs
- Verify MongoDB connection string
- Ensure all environment variables are set

**Problem**: CORS errors
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in server.js

**Problem**: Database connection failed
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure password doesn't have special characters (URL encode if needed)

### Frontend Issues

**Problem**: API calls failing
- Check REACT_APP_API_URL in Vercel environment variables
- Verify backend is running
- Check browser console for errors

**Problem**: Blank page after deployment
- Check Vercel build logs
- Verify build command is correct
- Check for console errors

---

## 📝 Alternative: Deploy to Heroku

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create exam-hall-backend
   ```

4. **Add MongoDB Atlas**
   - Use MongoDB Atlas connection string (from Step 1)

5. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set JWT_EXPIRE="7d"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="https://your-frontend-url.herokuapp.com"
   ```

6. **Create Procfile**
   Create `backend/Procfile`:
   ```
   web: node server.js
   ```

7. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

8. **Seed Data**
   ```bash
   heroku run node seedAdmin.js
   heroku run node seedDepartments.js
   heroku run node seedFaculty.js
   ```

### Frontend Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create exam-hall-frontend
   heroku buildpacks:set mars/create-react-app
   git push heroku main
   ```

---

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed

### Render Custom Domain

1. Go to Render service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

---

## 🔒 Production Checklist

### Security
- ✅ Change default passwords
- ✅ Use strong JWT_SECRET (at least 32 characters)
- ✅ Enable HTTPS (automatic on Vercel/Render)
- ✅ Restrict MongoDB IP whitelist (if possible)
- ✅ Add rate limiting (optional)

### Performance
- ✅ Enable compression in Express
- ✅ Add database indexes
- ✅ Optimize images
- ✅ Enable caching

### Monitoring
- ✅ Set up error logging (Sentry)
- ✅ Monitor uptime (UptimeRobot)
- ✅ Check performance (Google Lighthouse)

---

## 📊 Cost Breakdown

### Free Tier Limits

**Render Free:**
- 750 hours/month
- Sleeps after 15 min inactivity
- Wakes up on request (30s delay)

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**MongoDB Atlas Free:**
- 512 MB storage
- Shared RAM
- No backups

### Paid Upgrades (Optional)

**Render:**
- Starter: $7/month (no sleep)
- Standard: $25/month (more resources)

**Vercel:**
- Pro: $20/month (more bandwidth)

**MongoDB Atlas:**
- M10: $0.08/hour (~$57/month)

---

## 🎯 Quick Deploy Commands

```bash
# 1. Prepare for deployment
cd c:\Users\Sabareeshwaran\OneDrive\Desktop\mp\HALLALLOCATION

# 2. Create frontend .env
echo REACT_APP_API_URL=https://your-backend-url.onrender.com/api > frontend\.env

# 3. Commit and push
git add .
git commit -m "Production ready"
git push origin main

# 4. Deploy backend to Render (via dashboard)
# 5. Deploy frontend to Vercel (via dashboard)
# 6. Update FRONTEND_URL in Render
# 7. Test the application
```

---

## 📱 Mobile Responsive

Your app is already mobile-responsive. Test on:
- Chrome DevTools (F12 → Toggle device toolbar)
- Real mobile devices
- Different screen sizes

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Automatic Deploy**
   - Render detects changes → Rebuilds backend
   - Vercel detects changes → Rebuilds frontend

3. **Zero Downtime**
   - New version deployed alongside old
   - Traffic switched when ready

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Stack Overflow**: Tag questions with `render`, `vercel`, `mongodb`

---

## ✅ Post-Deployment

1. **Share Links**
   - Frontend: `https://your-app.vercel.app`
   - Backend API: `https://your-backend.onrender.com/api/health`

2. **Update README**
   - Add live demo links
   - Update installation instructions

3. **Test All Features**
   - Login as admin, faculty, student
   - Create departments, halls, exams
   - Upload students
   - Allocate seats
   - Download PDFs

4. **Monitor Performance**
   - Check Render logs for errors
   - Monitor Vercel analytics
   - Test from different locations

---

**Your app is now live! 🎉**

**Demo URLs:**
- Frontend: https://your-app-name.vercel.app
- Backend: https://exam-hall-backend.onrender.com
- API Health: https://exam-hall-backend.onrender.com/api/health
