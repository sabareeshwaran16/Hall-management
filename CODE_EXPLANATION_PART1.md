# Complete Code Explanation - Part 1: Backend Core Files

## 1. server.js - Application Entry Point

### Purpose:
Main file that starts the Express server and configures all middleware.

### Line-by-Line Explanation:

```javascript
require('dotenv').config();
```
- Loads environment variables from .env file
- Makes variables like PORT, MONGODB_URI available via process.env

```javascript
const express = require('express');
const cors = require('cors');
```
- Import Express framework for creating REST API
- Import CORS to allow frontend (port 3000) to call backend (port 5000)

```javascript
const connectDatabase = require('./config/database');
```
- Import database connection function

```javascript
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const facultyRoutes = require('./routes/faculty.routes');
const studentRoutes = require('./routes/student.routes');
```
- Import all route files
- Each file contains endpoints for specific user role

```javascript
const app = express();
```
- Create Express application instance

```javascript
connectDatabase();
```
- Connect to MongoDB database

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
```
- Enable CORS for frontend URL
- credentials: true allows cookies/auth headers

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- Parse incoming JSON requests
- Parse URL-encoded data (form submissions)

```javascript
const dirs = ['uploads', 'temp'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});
```
- Create folders for file uploads if they don't exist
- uploads: for CSV files
- temp: for temporary PDF generation

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
```
- Mount routes at specific paths
- Example: POST /api/auth/login goes to authRoutes

```javascript
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Exam Hall Allocation API is running',
        timestamp: new Date().toISOString()
    });
});
```
- Health check endpoint to verify server is running
- Used for monitoring/debugging

```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
```
- Global error handler middleware
- Catches all errors from routes
- Shows detailed errors only in development mode

```javascript
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
```
- 404 handler for undefined routes

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```
- Start server on specified port
- Default to 5000 if not in .env

---

## 2. models/User.js - User Schema

### Purpose:
Defines the structure of User documents in MongoDB and handles password hashing.

### Line-by-Line Explanation:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
```
- Mongoose: MongoDB object modeling tool
- bcryptjs: Library for hashing passwords

```javascript
const userSchema = new mongoose.Schema({
```
- Create schema (blueprint) for User collection

```javascript
email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
}
```
- type: Data type is String
- required: Field must be provided
- unique: No two users can have same email (creates index)
- lowercase: Converts to lowercase before saving
- trim: Removes whitespace
- match: Validates email format using regex

```javascript
password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
}
```
- select: false means password won't be returned in queries by default
- Must explicitly use .select('+password') to get it

```javascript
role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    default: 'student'
}
```
- enum: Only these three values allowed
- default: If not specified, user is 'student'

```javascript
department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
}
```
- ObjectId: Reference to another collection
- ref: Points to Department collection
- Enables population (joining data)

```javascript
isActive: {
    type: Boolean,
    default: true
}
```
- Flag to enable/disable user accounts

```javascript
}, {
    timestamps: true
});
```
- Automatically adds createdAt and updatedAt fields

### Middleware - Password Hashing:

```javascript
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
```
**Explanation:**
- pre('save'): Runs BEFORE saving document to database
- this.isModified('password'): Check if password field changed
- If password unchanged (updating other fields), skip hashing
- bcrypt.genSalt(10): Generate random salt (10 rounds)
- bcrypt.hash(): Hash password with salt
- next(): Continue to save operation

**Why hash passwords?**
- Never store plain text passwords
- If database is compromised, passwords are safe
- bcrypt is one-way (can't reverse hash to get password)

### Method - Compare Password:

```javascript
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```
**Explanation:**
- Custom method added to all User documents
- candidatePassword: Password user entered during login
- this.password: Hashed password from database
- bcrypt.compare(): Compares plain text with hash
- Returns true if match, false otherwise

**Usage in login:**
```javascript
const user = await User.findOne({ email }).select('+password');
const isMatch = await user.comparePassword(enteredPassword);
if (isMatch) {
    // Login successful
}
```

```javascript
module.exports = mongoose.model('User', userSchema);
```
- Export model for use in other files
- Creates 'users' collection in MongoDB (lowercase, plural)

---

## 3. middleware/auth.js - JWT Authentication Middleware

### Purpose:
Protects routes by verifying JWT tokens and extracting user information.

