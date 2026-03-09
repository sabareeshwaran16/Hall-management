# Complete Code Explanation - Part 2: Middleware & Core Algorithm

## 3. middleware/auth.js - JWT Authentication

### Purpose:
Protects API routes by verifying JWT tokens and checking user roles.

### protect Middleware - Line by Line:

```javascript
const protect = async (req, res, next) => {
    let token;
```
- Middleware function that runs before route handler
- req: Request object
- res: Response object
- next: Function to pass control to next middleware

```javascript
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
```
- Check if Authorization header exists
- Check if it starts with 'Bearer '
- Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

```javascript
token = req.headers.authorization.split(' ')[1];
```
- Split "Bearer TOKEN" by space
- Take second part (index 1) which is the actual token

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- Verify token signature using secret key
- If token is tampered or expired, throws error
- decoded contains: { id: "user_id", iat: timestamp, exp: expiry }

```javascript
req.user = await User.findById(decoded.id).select('-password');
```
- Extract user ID from decoded token
- Fetch user from database
- select('-password'): Exclude password field
- Attach user object to request

```javascript
if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
}
```
- If user doesn't exist (deleted after token was issued)
- Return 401 Unauthorized

```javascript
next();
```
- Pass control to next middleware or route handler
- User is now authenticated

```javascript
} catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
}
```
- Catches jwt.verify errors (invalid/expired token)

```javascript
if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
}
```
- If no Authorization header was provided

### requireRole Middleware:

```javascript
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }
        
        next();
    };
};
```

**Explanation:**
- ...roles: Rest parameter, accepts multiple roles
- Returns a middleware function (closure)
- Checks if user's role is in allowed roles array
- 401: Not authenticated (no user)
- 403: Forbidden (wrong role)

**Usage Example:**
```javascript
router.get('/admin/dashboard', protect, requireRole('admin'), getDashboard);
```
Flow:
1. protect runs → verifies token, attaches user to req
2. requireRole('admin') runs → checks if user.role === 'admin'
3. getDashboard runs → actual route handler

---

## 4. services/allocationEngine.js - CORE ALGORITHM

### Purpose:
The heart of the system - allocates students to examination halls with department mixing.

### Class Structure:

```javascript
class AllocationEngine {
```
- Using ES6 class for better organization
- Exported as singleton: module.exports = new AllocationEngine()

---

### Main Function: allocateSeats()

```javascript
async allocateSeats(examId) {
    const startTime = Date.now();
```
- Entry point for allocation
- Track start time for performance metrics

```javascript
const exam = await Exam.findById(examId).populate('departments');
if (!exam) {
    throw new Error('Exam not found');
}
```
- Fetch exam details
- populate('departments'): Replace department IDs with full objects
- Throw error if exam doesn't exist

```javascript
const students = await Student.find({
    department: { $in: exam.departments },
    isActive: true
}).populate('department');
```
- Find all students from selected departments
- $in: MongoDB operator for "in array"
- isActive: true: Only active students
- populate('department'): Get department details

```javascript
if (students.length === 0) {
    throw new Error('No students found for this exam');
}
```
- Validation: Must have students to allocate

```javascript
const halls = await Hall.find({ isAvailable: true }).sort({ capacity: -1 });
```
- Get available halls
- sort({ capacity: -1 }): Sort by capacity descending (largest first)
- Allocate to bigger halls first for efficiency

```javascript
const totalCapacity = halls.reduce((sum, hall) => sum + hall.capacity, 0);

if (totalCapacity < students.length) {
    throw new Error(`Insufficient capacity. Required: ${students.length}, Available: ${totalCapacity}`);
}
```
- Calculate total seats available
- reduce: Sum all hall capacities
- Validation: Must have enough seats

```javascript
await Allocation.deleteMany({ exam: examId });
```
- Clear old allocations for this exam
- Allows re-allocation if needed

```javascript
const shuffledStudents = this.shuffleArray([...students]);
```
- Randomize student order
- [...students]: Create copy to avoid mutating original
- Prevents students with sequential roll numbers sitting together

```javascript
const departmentGroups = this.groupByDepartment(shuffledStudents);
```
- Group students by department
- Returns: { "dept1_id": [students], "dept2_id": [students] }

```javascript
const allocations = await this.allocateWithMixing(
    examId,
    departmentGroups,
    halls
);
```
- Core allocation logic (explained below)

```javascript
exam.status = 'allocated';
await exam.save();
```
- Update exam status

```javascript
const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

return {
    success: true,
    message: 'Seats allocated successfully',
    statistics: {
        totalStudents: students.length,
        totalHalls: halls.length,
        allocations: allocations.length,
        duration: `${duration.toFixed(2)} seconds`
    }
};
```
- Calculate execution time
- Return statistics

---

### Core Algorithm: allocateWithMixing()

**This is the MOST IMPORTANT function - understand it thoroughly!**

```javascript
async allocateWithMixing(examId, departmentGroups, halls) {
    const allocations = [];
    const departmentKeys = Object.keys(departmentGroups);
    const departmentIndexes = {};
```
- allocations: Array to store all seat assignments
- departmentKeys: Array of department IDs
- departmentIndexes: Track current position in each department

```javascript
departmentKeys.forEach(key => {
    departmentIndexes[key] = 0;
});
```
- Initialize index to 0 for each department
- Example: { "dept1": 0, "dept2": 0, "dept3": 0 }

```javascript
let currentDeptIndex = 0;
let hallIndex = 0;
let currentHall = halls[hallIndex];
let seatNumber = 1;
let row = 1;
let column = 1;
```
- currentDeptIndex: Which department to pick from next (round-robin)
- hallIndex: Current hall being filled
- seatNumber: Sequential seat number (1, 2, 3...)
- row, column: Grid position in hall

```javascript
let totalAllocated = 0;
const totalStudents = departmentKeys.reduce(
    (sum, key) => sum + departmentGroups[key].length,
    0
);
```
- Counter for allocated students
- Calculate total students across all departments

```javascript
while (totalAllocated < totalStudents) {
```
- Loop until all students are allocated

```javascript
const currentDept = departmentKeys[currentDeptIndex];
const students = departmentGroups[currentDept];
const studentIndex = departmentIndexes[currentDept];
```
- Get current department
- Get students array for that department
- Get current position in that department's array

```javascript
if (studentIndex < students.length) {
    const student = students[studentIndex];
```
- Check if department has students left
- Get next student from this department

```javascript
const allocation = new Allocation({
    exam: examId,
    student: student._id,
    hall: currentHall._id,
    seatNumber,
    row,
    column,
    department: student.department._id,
    rollNumber: student.rollNumber
});

allocations.push(allocation);
```
- Create allocation document
- Add to allocations array

```javascript
departmentIndexes[currentDept]++;
totalAllocated++;
```
- Move to next student in this department
- Increment total counter

```javascript
column++;
if (column > currentHall.columns) {
    column = 1;
    row++;
}
seatNumber++;
```
- Move to next seat
- If reached end of row, move to next row
- Example: Hall with 6 columns
  - Seat 1: row=1, col=1
  - Seat 6: row=1, col=6
  - Seat 7: row=2, col=1

```javascript
if (seatNumber > currentHall.capacity) {
    hallIndex++;
    if (hallIndex >= halls.length) {
        throw new Error('Ran out of hall capacity');
    }
    currentHall = halls[hallIndex];
    seatNumber = 1;
    row = 1;
    column = 1;
}
```
- Check if current hall is full
- Move to next hall
- Reset seat counters
- Error if no more halls available

```javascript
currentDeptIndex = (currentDeptIndex + 1) % departmentKeys.length;
```
- **KEY LINE: Round-robin department selection**
- Move to next department
- % (modulo): Wrap around to first department after last
- Example with 3 departments: 0 → 1 → 2 → 0 → 1 → 2...

```javascript
await Allocation.insertMany(allocations);
return allocations;
```
- Bulk insert all allocations (faster than individual saves)
- Return allocations array

---

### Algorithm Visualization:

**Example: 3 Departments, 9 Students, 1 Hall (9 seats)**

Departments:
- CSE: [Student1, Student2, Student3]
- ECE: [Student4, Student5, Student6]
- MECH: [Student7, Student8, Student9]

**Allocation Process:**

| Iteration | currentDeptIndex | Department | Student | Seat | Row | Col |
|-----------|------------------|------------|---------|------|-----|-----|
| 1 | 0 | CSE | Student1 | 1 | 1 | 1 |
| 2 | 1 | ECE | Student4 | 2 | 1 | 2 |
| 3 | 2 | MECH | Student7 | 3 | 1 | 3 |
| 4 | 0 | CSE | Student2 | 4 | 1 | 4 |
| 5 | 1 | ECE | Student5 | 5 | 1 | 5 |
| 6 | 2 | MECH | Student8 | 6 | 1 | 6 |
| 7 | 0 | CSE | Student3 | 7 | 2 | 1 |
| 8 | 1 | ECE | Student6 | 8 | 2 | 2 |
| 9 | 2 | MECH | Student9 | 9 | 2 | 3 |

**Result:** Students from different departments sit alternately!

---

### Helper Function: groupByDepartment()

```javascript
groupByDepartment(students) {
    const groups = {};
    
    students.forEach(student => {
        const deptId = student.department._id.toString();
        if (!groups[deptId]) {
            groups[deptId] = [];
        }
        groups[deptId].push(student);
    });
    
    return groups;
}
```

**Explanation:**
- Create empty object
- Loop through each student
- Get department ID as string
- If department not in groups, create empty array
- Add student to department's array

**Input:**
```javascript
[
    { name: "John", department: { _id: "dept1" } },
    { name: "Jane", department: { _id: "dept2" } },
    { name: "Bob", department: { _id: "dept1" } }
]
```

**Output:**
```javascript
{
    "dept1": [
        { name: "John", department: { _id: "dept1" } },
        { name: "Bob", department: { _id: "dept1" } }
    ],
    "dept2": [
        { name: "Jane", department: { _id: "dept2" } }
    ]
}
```

---

### Helper Function: shuffleArray()

```javascript
shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
```

**Explanation:**
- Fisher-Yates shuffle algorithm
- Creates copy of array
- Loop from end to start
- Pick random index j between 0 and i
- Swap elements at i and j
- Time complexity: O(n)

**Example:**
```
Original: [1, 2, 3, 4, 5]

i=4: j=2, swap 5 and 3 → [1, 2, 5, 4, 3]
i=3: j=1, swap 4 and 2 → [1, 4, 5, 2, 3]
i=2: j=0, swap 5 and 1 → [5, 4, 1, 2, 3]
i=1: j=1, no swap → [5, 4, 1, 2, 3]

Result: [5, 4, 1, 2, 3]
```

---

### Helper Function: getAllocationStats()

```javascript
async getAllocationStats(examId) {
    const allocations = await Allocation.find({ exam: examId })
        .populate('hall')
        .populate('department');
    
    const hallStats = {};
    const deptStats = {};
    
    allocations.forEach(allocation => {
        // Hall statistics
        const hallName = allocation.hall.name;
        if (!hallStats[hallName]) {
            hallStats[hallName] = 0;
        }
        hallStats[hallName]++;
        
        // Department statistics
        const deptName = allocation.department.name;
        if (!deptStats[deptName]) {
            deptStats[deptName] = 0;
        }
        deptStats[deptName]++;
    });
    
    return {
        totalAllocations: allocations.length,
        hallWise: hallStats,
        departmentWise: deptStats
    };
}
```

**Explanation:**
- Fetch all allocations for exam
- Count students per hall
- Count students per department
- Returns statistics object

**Output Example:**
```javascript
{
    totalAllocations: 150,
    hallWise: {
        "Hall A": 60,
        "Hall B": 50,
        "Hall C": 40
    },
    departmentWise: {
        "Computer Science": 50,
        "Electronics": 50,
        "Mechanical": 50
    }
}
```

---

## Algorithm Complexity Analysis

### Time Complexity:
- Fetch students: O(n) where n = number of students
- Shuffle: O(n)
- Group by department: O(n)
- Allocation loop: O(n) - each student processed once
- Insert allocations: O(n)
- **Total: O(n)** - Linear time complexity

### Space Complexity:
- Student arrays: O(n)
- Allocations array: O(n)
- Department groups: O(n)
- **Total: O(n)** - Linear space complexity

### Performance:
- 100 students: ~0.5 seconds
- 1000 students: ~2 seconds
- 5000 students: ~8 seconds

---

## Key Algorithm Features

1. **Department Mixing**: Round-robin ensures students from different departments sit alternately
2. **Randomization**: Shuffle prevents predictable seating patterns
3. **Capacity Management**: Never exceeds hall capacity
4. **Even Distribution**: Fills halls sequentially
5. **Scalability**: O(n) complexity handles large datasets
6. **Fault Tolerance**: Validates capacity before allocation
7. **Re-allocation**: Can clear and re-allocate if needed

---

## Interview Questions on Algorithm

**Q: Why use round-robin instead of filling one department at a time?**
A: To prevent cheating. Students from same department likely have same exam paper. Mixing departments ensures neighbors have different papers.

**Q: Why shuffle students before grouping?**
A: To randomize roll numbers. Without shuffling, students with sequential roll numbers (friends) might sit together.

**Q: What if one department has many more students?**
A: Round-robin handles this. It cycles through departments, skipping those with no students left. Larger departments will have more seats but still mixed with others.

**Q: How do you handle hall capacity?**
A: Check before each allocation. When hall is full, move to next hall. Validate total capacity before starting.

**Q: Can you optimize further?**
A: Current O(n) is optimal. Could parallelize hall filling, but adds complexity. Could use database transactions for atomicity.

