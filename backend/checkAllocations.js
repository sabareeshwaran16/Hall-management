const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Allocation = require('./models/Allocation');
const Exam = require('./models/Exam');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');

        // Get the exam
        const exam = await Exam.findOne({});
        if (exam) {
            console.log(`Checking allocations for Exam: ${exam.name} (${exam._id})`);
            const count = await Allocation.countDocuments({ exam: exam._id });
            console.log(`TOTAL ALLOCATIONS: ${count}`);

            if (count > 0) {
                const sample = await Allocation.findOne({ exam: exam._id });
                console.log('Sample Allocation:', JSON.stringify(sample, null, 2));
            }
        } else {
            console.log('No exam found');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
