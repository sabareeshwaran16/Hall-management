const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('./models/Exam');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');
        const exams = await Exam.find({});
        console.log(`TOTAL EXAMS: ${exams.length}`);
        exams.forEach(e => {
            console.log(`ID: ${e._id} | Name: "${e.name}" | Depts: ${e.departments.length}`);
        });
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
