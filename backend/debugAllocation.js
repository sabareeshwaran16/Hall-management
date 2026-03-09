const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('./models/Exam');
const Student = require('./models/Student');
const Department = require('./models/Department');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');

        // 1. Check Departments
        const departments = await Department.find({});
        console.log('\n--- DEPARTMENTS ---');
        departments.forEach(d => console.log(`${d.code}: ${d._id}`));

        // 2. Check Exams
        const exams = await Exam.find({});
        console.log('\n--- EXAMS ---');
        for (const exam of exams) {
            console.log(`Exam: "${exam.name}" (ID: ${exam._id})`);
            console.log(`Linked Depts Count: ${exam.departments.length}`);
            console.log(`Linked Dept IDs: ${JSON.stringify(exam.departments)}`);
        }

        // 3. Check Students
        const students = await Student.countDocuments({});
        console.log(`\nTotal Students in DB: ${students}`);

        if (students > 0) {
            const sample = await Student.findOne({}).populate('department');
            console.log(`Sample Student: ${sample.name}, Dept: ${sample.department ? sample.department.code : 'NULL'} (${sample.department ? sample.department._id : sample.department})`);

            // Group count
            const agg = await Student.aggregate([
                { $group: { _id: "$department", count: { $sum: 1 } } }
            ]);
            console.log('Student Counts per Dept ID:', agg);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
