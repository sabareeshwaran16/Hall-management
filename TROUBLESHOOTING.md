# 🔧 TROUBLESHOOTING GUIDE
## Login Issues & Common Problems

---

## ❌ PROBLEM: "Not signing in and opening"

### ✅ SOLUTION: Follow This Checklist

### **Step 1: Is the Backend Running?**

Check your backend terminal. You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**If NOT running:**
- Wait for `npm install` to complete in the backend terminal
- Then run: `npm run dev`

**If you see errors:**
- Make sure MongoDB is installed and running
- Run: `Start-Service MongoDB` in PowerShell

---

### **Step 2: Is the Frontend Running?**

Check your frontend terminal. You should see:
```
Compiled successfully!
webpack compiled with 1 warning

You can now view exam-hall-allocation-frontend in the browser.
  Local:            http://localhost:3000
```

**The warning is NORMAL and won't prevent the app from working.**

---

### **Step 3: Did You Create the Admin User?**

**IMPORTANT:** You MUST create an admin user before you can login!

Open a **NEW terminal** and run:

```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"email\": \"xyz@gmail.com\",\"password\": \"12345\",\"name\": \"System Administrator\",\"role\": \"admin\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "System Administrator",
    "email": "xyz@gmail.com",
    "role": "admin"
  }
}
```

**If you get an error:**
- Make sure backend is running on port 5000
- Check if user already exists (try logging in instead)

---

### **Step 4: Open the Browser**

1. Open browser manually: **http://localhost:3000**
2. You should see the login page

**If page doesn't load:**
- Check if frontend is running
- Try: http://127.0.0.1:3000
- Clear browser cache (Ctrl+Shift+Delete)

---

### **Step 5: Login**

Enter credentials:
- **Email:** `xyz@gmail.com`
- **Password:** `12345`

**If login fails:**

**Error: "Invalid credentials"**
- User doesn't exist → Create admin user (Step 3)
- Wrong password → Use correct password: `12345`

**Error: "Network Error" or "Cannot connect"**
- Backend is not running → Start backend
- Wrong API URL → Check `frontend/.env` has: `REACT_APP_API_URL=http://localhost:5000/api`

**Error: "CORS error"**
- Backend CORS issue → Check `backend/.env` has: `FRONTEND_URL=http://localhost:3000`
- Restart backend server

---

## 🔍 QUICK DIAGNOSTIC

Run these commands to check everything:

### Check if Backend is Running:
```powershell
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"OK","message":"Exam Hall Allocation API is running",...}`

### Check if Frontend is Accessible:
Open in browser: http://localhost:3000

### Check if MongoDB is Running:
```powershell
Get-Service MongoDB
```
**Expected:** Status = Running

---

## 🚀 COMPLETE RESTART PROCEDURE

If nothing works, do a complete restart:

### 1. Stop Everything
- Close all terminals (Ctrl+C)
- Stop MongoDB: `Stop-Service MongoDB`

### 2. Start MongoDB
```powershell
Start-Service MongoDB
```

### 3. Start Backend
```powershell
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\backend
npm run dev
```
Wait for: "MongoDB Connected"

### 4. Start Frontend (New Terminal)
```powershell
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\frontend
npm start
```
Wait for: "Compiled successfully"

### 5. Create Admin (New Terminal)
```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"email\": \"xyz@gmail.com\",\"password\": \"12345\",\"name\": \"System Administrator\",\"role\": \"admin\"}'
```

### 6. Login
- Go to: http://localhost:3000
- Email: xyz@gmail.com
- Password: 12345

---

## 📋 COMMON ERRORS & FIXES

### "User already exists"
✅ **Solution:** The admin user is already created. Just login!

### "MongoDB connection failed"
✅ **Solution:** 
```powershell
Start-Service MongoDB
```

### "Port 5000 already in use"
✅ **Solution:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot find module"
✅ **Solution:**
```powershell
npm install
```

### Browser shows blank page
✅ **Solution:**
- Clear cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check browser console (F12) for errors

---

## 📞 STILL NOT WORKING?

### Check Browser Console (F12)
Look for errors in the Console tab. Common issues:
- CORS errors → Check backend CORS settings
- Network errors → Backend not running
- 404 errors → Wrong API URL

### Check Backend Terminal
Look for errors when you try to login. Common issues:
- JWT errors → Check JWT_SECRET in .env
- Database errors → MongoDB not running
- Validation errors → Check request format

---

## ✅ VERIFICATION CHECKLIST

Before asking for help, verify:

- [ ] MongoDB service is running
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Frontend terminal shows "Compiled successfully"
- [ ] http://localhost:5000/api/health returns OK
- [ ] http://localhost:3000 loads the login page
- [ ] Admin user has been created
- [ ] Using correct email: xyz@gmail.com
- [ ] Using correct password: 12345

---

**If all checks pass and it still doesn't work, check the browser console (F12) and backend terminal for specific error messages!**
