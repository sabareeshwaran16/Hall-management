const mongoose = require('mongoose');
const dotenv = require('dotenv');
const allocationEngine = require('./services/allocationEngine');
const Exam = require('./models/Exam');
const Student = require('./models/Student');
const Hall = require('./models/Hall');
const Department = require('./models/Department');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');

        // Find exam
        const exam = await Exam.findOne({ name: { $regex: /ADD/ } });
        if (!exam) {
            console.log('Exam not found');
            process.exit(0);
        }
        console.log(`Testing allocation for Exam: ${exam.name} (${exam._id})`);

        // Check Pre-conditions matches Engine
        const examWithDepts = await Exam.findById(exam._id).populate('departments');
        console.log(`Exam Depts: ${examWithDepts.departments.length}`);

        const students = await Student.find({
            department: { $in: examWithDepts.departments },
            isActive: true
        }).populate('department');
        console.log(`Students Found: ${students.length}`);

        if (students.length === 0) {
            console.log('ERROR: No students found matching request');
            // Debug why
            const allStudents = await Student.find({});
            console.log(`Total Students in DB: ${allStudents.length}`);
            if (allStudents.length > 0) {
                console.log(`Sample Student Dept: ${allStudents[0].department}`);
                console.log(`Exam Dept IDs: ${examWithDepts.departments.map(d => d._id)}`);
            }
        }

        try {
            console.log('Running Engine...');
            const result = await allocationEngine.allocateSeats(exam._id);
            console.log('Result:', JSON.stringify(result, null, 2));
        } catch (error) {
            console.error('Engine Error:', error.message);
            console.error(error.stack);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
