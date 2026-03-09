const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./models/Department');

// Load env vars
dotenv.config();

// Connect to DB
// Use the exact URI from .env to match the running application
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation';
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB Connected');
        await seedDepartments();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedDepartments = async () => {
    const departments = [
        { name: 'Computer Science & Engineering', code: 'CSE', subjects: [{ name: 'Data Structures', code: 'CS101' }] },
        { name: 'Electronics & Communication', code: 'ECE', subjects: [{ name: 'Digital Electronics', code: 'EC101' }] },
        { name: 'Mechanical Engineering', code: 'MECH', subjects: [{ name: 'Thermodynamics', code: 'ME101' }] },
        { name: 'Civil Engineering', code: 'CIVIL', subjects: [{ name: 'Fluid Mechanics', code: 'CE101' }] }
    ];

    try {
        for (const dept of departments) {
            const exists = await Department.findOne({ code: dept.code });
            if (!exists) {
                await Department.create(dept);
                console.log(`Created Department: ${dept.code}`);
            } else {
                console.log(`Department ${dept.code} already exists`);
            }
        }
        console.log('Department Seeding Completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding departments:', error);
        process.exit(1);
    }
};
