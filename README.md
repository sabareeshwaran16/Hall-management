# Digital Exam Hall Allocation & Control System

A comprehensive MERN stack web application for automating exam hall allocation and seating arrangements in colleges.

## 🎯 Project Overview

This system automates the entire process of exam hall allocation, from student registration to seat assignment and hall ticket generation. It eliminates manual work, reduces errors, and ensures fair distribution of students across examination halls.

## ✨ Key Features

### For Administrators
- Create and manage examination schedules
- Add and configure examination halls with seating capacity
- Manage departments and their subjects
- Bulk upload student data via CSV files
- Automated seat allocation with intelligent department mixing
- Assign invigilators to examination halls
- Generate comprehensive reports and analytics

### For Faculty Members
- View assigned examination halls and duties
- Download attendance sheets in PDF format
- Access seating charts for assigned halls
- View complete seating layout

### For Students
- View personalized exam timetable
- Check seat allocation details (hall number, seat number)
- Download hall ticket with all exam details

## 🏗️ Technical Architecture

### Technology Stack
- **Frontend**: React.js, React Router, Axios, Context API
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcryptjs for password hashing, JWT for authentication
- **PDF Generation**: PDFKit library
- **File Processing**: CSV parser for bulk uploads

### Project Structure
```
HALLALLOCATION/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Data models (User, Student, Hall, Exam, etc.)
│   ├── controllers/     # Business logic handlers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Authentication & authorization
│   ├── services/        # Core services (allocation, PDF, CSV)
│   └── server.js        # Application entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Global state management
    │   ├── pages/       # Page components
    │   └── services/    # API integration
    └── public/
```

## 🎨 Core Algorithm: Seat Allocation Engine

The system uses an intelligent allocation algorithm with these features:

1. **Department Mixing**: Alternates students from different departments to prevent cheating
2. **Random Distribution**: Shuffles roll numbers to avoid predictable patterns
3. **Capacity Management**: Ensures no hall exceeds its maximum capacity
4. **Equal Distribution**: Balances student count across all available halls
5. **Session Support**: Handles both Forenoon (FN) and Afternoon (AN) sessions

**Performance**: 
- Time Complexity: O(n) where n = number of students
- Can allocate 1000+ students in under 5 seconds

## 📊 Database Schema

### Collections
1. **Users**: Stores authentication credentials and user roles (admin/faculty/student)
2. **Departments**: Department information with codes and subjects
3. **Students**: Student records linked to departments and user accounts
4. **Halls**: Examination hall details including capacity and layout
5. **Exams**: Exam schedules with dates, sessions, and participating departments
6. **Allocations**: Seat assignments linking students to specific seats in halls
7. **Invigilators**: Faculty assignments to examination halls

## 🔐 Security Features

- Password hashing using bcrypt with salt rounds
- JWT-based stateless authentication
- Role-based access control (RBAC)
- Protected API routes with middleware
- Input validation and sanitization
- Secure session management

## 📝 CSV Upload Format

For bulk student uploads, use this format:

```csv
rollNumber,name,email,departmentCode,year
CS001,John Doe,john@example.com,CSE,2
CS002,Jane Smith,jane@example.com,CSE,2
EC001,Bob Johnson,bob@example.com,ECE,3
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
# Configure .env file with MongoDB URI and JWT secret
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing the Application

1. Start both backend and frontend servers
2. Create departments (CSE, ECE, MECH, etc.)
3. Add examination halls with capacity details
4. Upload student data using CSV file
5. Create an exam and select participating departments
6. Trigger the seat allocation process
7. View results and download reports

## 📦 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - New user registration
- `GET /api/auth/me` - Get current user profile

### Admin Operations
- `GET /api/admin/exams` - List all exams
- `POST /api/admin/exams` - Create new exam
- `POST /api/admin/allocate/:examId` - Run allocation algorithm
- `POST /api/admin/students/upload` - Bulk upload students
- `GET /api/admin/departments` - Manage departments
- `GET /api/admin/halls` - Manage examination halls

### Faculty Operations
- `GET /api/faculty/assigned-halls` - View assigned duties
- `GET /api/faculty/attendance/:examId/:hallId` - Download attendance sheet

### Student Operations
- `GET /api/student/timetable` - View exam schedule
- `GET /api/student/hall-ticket/:examId` - Download hall ticket

## 🎯 Use Cases

1. **University Exam Management**: Automate seat allocation for semester exams
2. **Competitive Exams**: Manage large-scale entrance examinations
3. **School Assessments**: Handle annual examination logistics
4. **Training Centers**: Organize certification exam seating

## 🔮 Future Enhancements

- Email/SMS notifications for hall tickets
- QR code-based verification system
- Mobile application for students
- Analytics dashboard with insights
- Multi-campus support
- Exam clash detection
- Historical data analysis and reporting
- Integration with student information systems

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

Built with ❤️ using the MERN Stack

---

**For support or queries, please create an issue in the repository.**
