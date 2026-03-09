# 🔑 CREATE ADMIN USER
## Custom Credentials: xyz@gmail.com / 12345

---

## ⚡ QUICK COMMAND

Once your backend is running on http://localhost:5000, use this command:

### PowerShell Command:
```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"email\": \"xyz@gmail.com\",\"password\": \"12345\",\"name\": \"System Administrator\",\"role\": \"admin\"}'
```

---

## 📝 OR Use This JSON in Postman/Insomnia

**URL:** `http://localhost:5000/api/auth/register`  
**Method:** `POST`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**
```json
{
  "email": "xyz@gmail.com",
  "password": "12345",
  "name": "System Administrator",
  "role": "admin"
}
```

---

## 🔐 LOGIN CREDENTIALS

After creating the admin user, login at http://localhost:3000 with:

- **Email:** `xyz@gmail.com`
- **Password:** `12345`

---

## ✅ COMPLETE STARTUP SEQUENCE

### Step 1: Wait for npm install to complete
Your terminals are currently running:
- Backend: `npm install` (running for ~2m40s)
- Frontend: `npm install` (running for ~1m58s)

### Step 2: Start Backend (After install completes)
In the backend terminal, run:
```powershell
npm run dev
```

Wait for: `Server running in development mode on port 5000`

### Step 3: Start Frontend (After install completes)
In the frontend terminal, run:
```powershell
npm start
```

Wait for browser to open at: `http://localhost:3000`

### Step 4: Create Admin User
In a NEW terminal, run:
```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"email\": \"xyz@gmail.com\",\"password\": \"12345\",\"name\": \"System Administrator\",\"role\": \"admin\"}'
```

### Step 5: Login
- Go to http://localhost:3000
- Email: `xyz@gmail.com`
- Password: `12345`

---

## 🎯 YOU'RE ALL SET!

Start creating departments, halls, and allocating seats! 🚀
