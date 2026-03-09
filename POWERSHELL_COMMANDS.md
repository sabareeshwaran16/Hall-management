# ✅ CORRECT POWERSHELL COMMANDS

## 🔑 Create Admin User (POWERSHELL SYNTAX)

Your backend is running! ✅  
Now create the admin user with this **PowerShell** command:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email": "xyz@gmail.com","password": "12345","name": "System Administrator","role": "admin"}'
```

**Expected Response:**
```
success : True
token   : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
user    : @{id=...; name=System Administrator; email=xyz@gmail.com; role=admin}
```

---

## 🔐 LOGIN CREDENTIALS

After creating the admin user, go to:
**http://localhost:3000**

Login with:
- **Email:** `xyz@gmail.com`
- **Password:** `12345`

---

## 📋 OTHER USEFUL POWERSHELL COMMANDS

### Check Backend Health
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

### Create Faculty User
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email": "faculty@college.edu","password": "faculty123","name": "Dr. Faculty Member","role": "faculty"}'
```

### Create Student User
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email": "student@college.edu","password": "student123","name": "Test Student","role": "student"}'
```

---

## ⚠️ NOTE: curl vs PowerShell

**DON'T USE** (Linux/Mac curl syntax):
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"email": "xyz@gmail.com"}'
```

**USE THIS** (PowerShell syntax):
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email": "xyz@gmail.com","password": "12345","name": "System Administrator","role": "admin"}'
```

---

## ✅ CURRENT STATUS

- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ⏳ Admin User: Creating now...
- ⏳ Login: Ready after admin creation

---

**Next Step:** Open http://localhost:3000 and login! 🚀
