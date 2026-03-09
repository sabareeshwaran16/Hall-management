# ⚡ QUICK REFERENCE - Run Commands
## Copy & Paste These Commands

---

## 🚀 STEP 1: BACKEND

```powershell
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\backend
npm install
npm run dev
```

**Keep this terminal open!**  
✅ Backend runs on: http://localhost:5000

---

## 🚀 STEP 2: FRONTEND (New Terminal)

```powershell
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\frontend
npm install
npm start
```

**Keep this terminal open!**  
✅ Frontend runs on: http://localhost:3000

---

## 🚀 STEP 3: CREATE ADMIN USER

```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"email\": \"admin@college.edu\",\"password\": \"admin123\",\"name\": \"System Administrator\",\"role\": \"admin\"}'
```

---

## 🚀 STEP 4: LOGIN & USE

1. Open: http://localhost:3000
2. Login:
   - Email: `admin@college.edu`
   - Password: `admin123`
3. Create departments, halls, upload students, create exam, allocate seats!

---

## 📝 SAMPLE DATA

**Upload this file for students:**
```
C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\sample_students.csv
```

---

## 🔧 TROUBLESHOOTING

**MongoDB not running?**
```powershell
Start-Service MongoDB
```

**Port 5000 in use?**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Clear npm cache:**
```powershell
npm cache clean --force
```

---

## 📚 FULL GUIDE

See: `RUN_COMMANDS.md` for complete instructions

---

**That's it! You're ready to go! 🎉**
