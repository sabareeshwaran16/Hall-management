# Digital Exam Hall Allocation & Control System

A comprehensive MERN stack web application for automating exam hall allocation and seating arrangements in colleges.

## 🎯 Features

### Admin Features
- **Exam Management**: Create and manage exams with date, session (FN/AN), and departments
- **Hall Management**: Add and manage examination halls with capacity
- **Department Management**: Manage departments and subjects
- **Student Management**: Bulk upload students via CSV
- **Seat Allocation Engine**: Automated seat allocation with department mixing
- **Invigilator Assignment**: Assign faculty to examination halls
- **Reports**: Generate and download PDF reports

### Faculty Features
- View assigned examination halls
- Download attendance sheets (PDF)
- Download seating charts (PDF)
- View seating layout for assigned halls

### Student Features
- View exam timetable
- View seat allocation (hall number, seat number)
- Download hall ticket (PDF)

## 🏗️ Architecture

```
HALLALLOCATION/
├── backend/                 # Express.js Backend
│   ├── config/             # Database configuration
│   ├── models/             # Mongoose models
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── services/           # Business logic
│   │   ├── allocationEngine.js  # Core allocation algorithm
│   │   ├── pdfGenerator.js      # PDF generation
│   │   └── csvParser.js         # CSV parsing
│   └── server.js           # Entry point
│
└── frontend/               # React Frontend
    ├── public/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # React Context (Auth)
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── App.js          # Main app component
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Edit `.env` file with your MongoDB URI and JWT secret:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam_hall_allocation
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📊 Database Schema

### Collections
- **Users**: Authentication and role management
- **Departments**: Department information
- **Students**: Student records
- **Halls**: Examination hall details
- **Exams**: Exam information
- **Allocations**: Seat allocation records
- **Invigilators**: Faculty assignments

## 🔐 Default Credentials

For testing purposes, create users with these roles:

**Admin:**
- Email: admin@college.edu
- Password: admin123

**Faculty:**
- Email: faculty@college.edu
- Password: faculty123

**Student:**
- Email: student@college.edu
- Password: student123

## 🎨 Allocation Algorithm

The system uses a rule-based allocation engine with the following features:

1. **Department Mixing**: Students from different departments are seated alternately
2. **Capacity Validation**: Never exceeds hall capacity
3. **Roll Number Shuffling**: Randomizes student order
4. **Equal Distribution**: Distributes students evenly across available halls
5. **Session Support**: Handles Forenoon (FN) and Afternoon (AN) sessions

**Algorithm Complexity**: O(n) where n is the number of students
**Performance**: Allocates 1000+ students in under 5 seconds

## 📝 CSV Upload Format

For bulk student upload, use this CSV format:

```csv
rollNumber,name,email,departmentCode,year
CS001,John Doe,john@example.com,CSE,2
CS002,Jane Smith,jane@example.com,CSE,2
EC001,Bob Johnson,bob@example.com,ECE,3
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/exams` - Get all exams
- `POST /api/admin/exams` - Create exam
- `POST /api/admin/allocate/:examId` - Trigger allocation
- `POST /api/admin/students/upload` - Upload students CSV

### Faculty
- `GET /api/faculty/assigned-halls` - Get assigned halls
- `GET /api/faculty/attendance/:examId/:hallId` - Download attendance

### Student
- `GET /api/student/timetable` - Get exam timetable
- `GET /api/student/hall-ticket/:examId` - Download hall ticket

## 🧪 Testing

1. Create departments (CSE, ECE, MECH, etc.)
2. Create examination halls with capacity
3. Upload student data via CSV
4. Create an exam and select departments
5. Trigger seat allocation
6. View allocation results and download reports

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_API_URL` environment variable

## 📦 Technologies Used

**Backend:**
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- PDFKit - PDF generation
- csv-parser - CSV parsing

**Frontend:**
- React - UI library
- React Router - Routing
- Axios - HTTP client
- Context API - State management

## 🔮 Future Enhancements

1. Email notifications for hall tickets
2. SMS integration
3. QR code verification
4. Analytics dashboard
5. Mobile app
6. Multi-campus support
7. Exam clash detection
8. Historical data analysis

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack**
