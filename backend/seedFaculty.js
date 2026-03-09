const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');

        const semester = await Department.findOne({ code: 'CSE' });
        const deptId = semester ? semester._id : null;

        const facultyList = [
            { name: 'Dr. Alan Turing', email: 'alan@college.edu', role: 'faculty' },
            { name: 'Prof. Grace Hopper', email: 'grace@college.edu', role: 'faculty' },
            { name: 'Dr. John von Neumann', email: 'john@college.edu', role: 'faculty' },
            { name: 'Prof. Ada Lovelace', email: 'ada@college.edu', role: 'faculty' }
        ];

        for (const fac of facultyList) {
            const exists = await User.findOne({ email: fac.email });
            if (!exists) {
                const user = new User({
                    ...fac,
                    password: 'password123',
                    department: deptId
                });
                await user.save();
                console.log(`Created Faculty: ${fac.name}`);
            } else {
                console.log(`Faculty ${fac.name} already exists`);
            }
        }

        console.log('Faculty Seeding Completed!');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
