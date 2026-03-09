# Quick Start Guide

## Step 1: Install MongoDB
Make sure MongoDB is installed and running on your system.

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Check if MongoDB is running:**
```bash
mongosh
```

## Step 2: Setup Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:5000

## Step 3: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will start on http://localhost:3000

## Step 4: Create Initial Data

### 4.1 Create Admin User

Use MongoDB Compass or mongosh to create an admin user:

```javascript
use exam_hall_allocation

db.users.insertOne({
  email: "admin@college.edu",
  password: "$2a$10$YourHashedPasswordHere",  // Use bcrypt to hash "admin123"
  name: "System Administrator",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the registration API:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@college.edu",
  "password": "admin123",
  "name": "System Administrator",
  "role": "admin"
}
```

### 4.2 Login and Create Departments

1. Login at http://localhost:3000/login with admin credentials
2. Navigate to Department Management
3. Create departments:
   - CSE (Computer Science Engineering)
   - ECE (Electronics & Communication Engineering)
   - MECH (Mechanical Engineering)
   - CIVIL (Civil Engineering)

### 4.3 Create Halls

Navigate to Hall Management and create halls:
- Hall A (Capacity: 60, Building: Main Block)
- Hall B (Capacity: 50, Building: Main Block)
- Hall C (Capacity: 40, Building: Annex Block)

### 4.4 Upload Students

1. Navigate to Student Management
2. Use the sample CSV file: `sample_students.csv`
3. Upload the file

### 4.5 Create an Exam

1. Navigate to Exam Management
2. Create a new exam:
   - Name: "Mid-Term Examination"
   - Date: Select a future date
   - Session: Forenoon (FN)
   - Duration: 180 minutes
   - Select all departments

### 4.6 Allocate Seats

1. Navigate to Seat Allocation
2. Select the exam you created
3. Click "Allocate Seats"
4. View the allocation results

## Step 5: Test Different Roles

### Create Faculty User
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "faculty@college.edu",
  "password": "faculty123",
  "name": "Dr. Faculty Member",
  "role": "faculty"
}
```

### Create Student User
First create a student record, then link it to a user account.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: It will prompt to use a different port

### CORS Error
- Ensure FRONTEND_URL in backend/.env matches your frontend URL

## Default Ports
- Backend: 5000
- Frontend: 3000
- MongoDB: 27017

## Next Steps
- Assign invigilators to exam halls
- Download reports (hall tickets, attendance sheets)
- Test faculty and student dashboards
