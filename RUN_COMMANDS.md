# 🚀 COMPLETE SETUP & RUN GUIDE
## Digital Exam Hall Allocation System

---

## ⚡ QUICK START (Copy & Paste Commands)

### Step 1: Install MongoDB

**Download & Install MongoDB:**
- Visit: https://www.mongodb.com/try/download/community
- Download MongoDB Community Server for Windows
- Run the installer and follow the setup wizard
- MongoDB will start automatically as a Windows service

**Verify MongoDB is Running:**
```powershell
# Open PowerShell and run:
mongosh

# You should see MongoDB shell. Type 'exit' to quit.
```

---

### Step 2: Setup Backend

**Open PowerShell/Terminal and navigate to backend folder:**

```powershell
# Navigate to backend directory
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\backend

# Install all dependencies
npm install

# Start the backend server
npm run dev
```

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

✅ **Backend is now running on: http://localhost:5000**

**Keep this terminal open!**

---

### Step 3: Setup Frontend

**Open a NEW PowerShell/Terminal window:**

```powershell
# Navigate to frontend directory
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\frontend

# Install all dependencies
npm install

# Start the React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view exam-hall-allocation-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ **Frontend will automatically open in your browser at: http://localhost:3000**

**Keep this terminal open too!**

---

## 📝 INITIAL DATA SETUP

### Step 4: Create Admin User

**Option A: Using MongoDB Compass (Recommended)**

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Create database: `exam_hall_allocation`
4. Create collection: `users`
5. Insert document:

```json
{
  "email": "admin@college.edu",
  "password": "$2a$10$YourHashedPasswordHere",
  "name": "System Administrator",
  "role": "admin",
  "isActive": true,
  "createdAt": {"$date": "2026-02-02T14:00:00.000Z"},
  "updatedAt": {"$date": "2026-02-02T14:00:00.000Z"}
}
```

**Option B: Using API (Easier)**

Open a new PowerShell and run:

```powershell
# Create admin user via API
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@college.edu",
    "password": "admin123",
    "name": "System Administrator",
    "role": "admin"
  }'
```

Or use Postman/Insomnia:
- URL: `http://localhost:5000/api/auth/register`
- Method: POST
- Body (JSON):
```json
{
  "email": "admin@college.edu",
  "password": "admin123",
  "name": "System Administrator",
  "role": "admin"
}
```

---

### Step 5: Login & Create Initial Data

1. **Open browser**: http://localhost:3000
2. **Login** with:
   - Email: `admin@college.edu`
   - Password: `admin123`

3. **Create Departments:**
   - Click "Department Management"
   - Add these departments:
     - Name: "Computer Science Engineering", Code: "CSE"
     - Name: "Electronics & Communication", Code: "ECE"
     - Name: "Mechanical Engineering", Code: "MECH"
     - Name: "Civil Engineering", Code: "CIVIL"

4. **Create Halls:**
   - Click "Hall Management"
   - Add these halls:
     - Name: "Hall A", Capacity: 60, Building: "Main Block", Rows: 10, Columns: 6
     - Name: "Hall B", Capacity: 50, Building: "Main Block", Rows: 10, Columns: 5
     - Name: "Hall C", Capacity: 40, Building: "Annex Block", Rows: 8, Columns: 5

5. **Upload Students:**
   - Click "Student Management"
   - Click "Upload CSV"
   - Select file: `C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\sample_students.csv`
   - Click Upload

6. **Create Exam:**
   - Click "Exam Management"
   - Click "+ Add Exam"
   - Fill in:
     - Exam Name: "Mid-Term Examination"
     - Date: Select a future date
     - Session: Forenoon (FN)
     - Duration: 180
     - Departments: Select all (CSE, ECE, MECH, CIVIL)
   - Click "Create Exam"

7. **Allocate Seats:**
   - Click "Seat Allocation"
   - Select the exam you created
   - Click "Allocate Seats"
   - Wait 2-3 seconds
   - View the allocation results!

---

## 🎯 TESTING THE SYSTEM

### Test Admin Features
✅ Already logged in as admin
- View all exams, halls, departments
- See allocation statistics
- Download reports

### Test Faculty Features

**Create Faculty User:**
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "faculty@college.edu",
    "password": "faculty123",
    "name": "Dr. Faculty Member",
    "role": "faculty"
  }'
```

**Assign Faculty as Invigilator:**
1. Login as admin
2. Go to "Invigilator Assignment"
3. Assign the faculty to an exam hall

**Login as Faculty:**
1. Logout from admin
2. Login with:
   - Email: `faculty@college.edu`
   - Password: `faculty123`
3. View assigned halls
4. Download attendance sheet
5. Download seating chart

### Test Student Features

**Create Student User:**

First, note a student's roll number from the uploaded CSV (e.g., CS001)

Then create user account:
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "student@college.edu",
    "password": "student123",
    "name": "Test Student",
    "role": "student"
  }'
```

**Link Student to User:**
Use MongoDB Compass to update the student record:
- Find student with roll number "CS001"
- Add field: `userId` with the ObjectId of the user you just created

**Login as Student:**
1. Logout
2. Login with:
   - Email: `student@college.edu`
   - Password: `student123`
3. View exam timetable
4. View seat allocation
5. Download hall ticket

---

## 🔧 TROUBLESHOOTING

### MongoDB Not Running
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Start MongoDB service
Start-Service MongoDB

# Or restart it
Restart-Service MongoDB
```

### Port Already in Use

**Backend (Port 5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
- React will automatically prompt to use a different port
- Press 'Y' to use port 3001 instead

### Cannot Connect to MongoDB
- Ensure MongoDB is installed and running
- Check connection string in `backend/.env`:
  ```
  MONGODB_URI=mongodb://localhost:27017/exam_hall_allocation
  ```

### CORS Error
- Ensure backend is running on port 5000
- Check `backend/.env` has:
  ```
  FRONTEND_URL=http://localhost:3000
  ```

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📋 COMPLETE COMMAND REFERENCE

### Backend Commands
```powershell
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\backend

# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start

# Run tests (if configured)
npm test
```

### Frontend Commands
```powershell
cd C:\Users\Sabareeshwaran\OneDrive\Desktop\HALLALLOCATION\frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### MongoDB Commands
```powershell
# Start MongoDB shell
mongosh

# Connect to specific database
mongosh mongodb://localhost:27017/exam_hall_allocation

# Show all databases
show dbs

# Use specific database
use exam_hall_allocation

# Show all collections
show collections

# Query users
db.users.find()

# Query students
db.students.find()

# Query allocations
db.allocations.find()

# Exit MongoDB shell
exit
```

---

## 🌐 ACCESS URLS

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |
| MongoDB | mongodb://localhost:27017 |

---

## 📊 API TESTING (Using PowerShell)

### Health Check
```powershell
curl http://localhost:5000/api/health
```

### Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@college.edu",
    "password": "admin123"
  }'
```

### Get All Exams (Replace TOKEN with actual JWT)
```powershell
curl http://localhost:5000/api/admin/exams `
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🎓 WORKFLOW SUMMARY

1. ✅ Install MongoDB
2. ✅ Run backend: `cd backend && npm install && npm run dev`
3. ✅ Run frontend: `cd frontend && npm install && npm start`
4. ✅ Create admin user via API
5. ✅ Login at http://localhost:3000
6. ✅ Create departments
7. ✅ Create halls
8. ✅ Upload students (CSV)
9. ✅ Create exam
10. ✅ Allocate seats
11. ✅ View results & download PDFs

---

## 🚀 YOU'RE ALL SET!

The system is now running and ready to use. Open http://localhost:3000 in your browser and start managing exam hall allocations!

**Need Help?**
- Check [README.md](file:///C:/Users/Sabareeshwaran/OneDrive/Desktop/HALLALLOCATION/README.md)
- Check [QUICKSTART.md](file:///C:/Users/Sabareeshwaran/OneDrive/Desktop/HALLALLOCATION/QUICKSTART.md)
- Review error messages in the terminal

**Happy Testing! 🎉**
