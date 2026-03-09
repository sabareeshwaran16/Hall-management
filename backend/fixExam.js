const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('./models/Exam');
const Department = require('./models/Department');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');

        const exam = await Exam.findOne({});
        if (!exam) {
            console.log('No exam found to fix');
            process.exit(0);
        }

        const departments = await Department.find({});
        if (departments.length === 0) {
            console.log('No departments found to link');
            process.exit(0);
        }

        exam.departments = departments.map(d => d._id);
        await exam.save();

        console.log(`SUCCESS: Linked ${departments.length} departments to Exam "${exam.name}"`);
        console.log('You can now run allocation.');

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
