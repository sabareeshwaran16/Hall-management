const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Department = require('./models/Department');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');

        // 1. Total Students
        const count = await Student.countDocuments({});
        console.log(`TOTAL STUDENTS: ${count}`);

        if (count === 0) {
            console.log('!!! NO STUDENTS FOUND !!!');
            console.log('User needs to upload CSV.');
        } else {
            // 2. Sample Student
            const sample = await Student.findOne({}).populate('department');
            console.log(`Sample: ${sample.name}, DeptCode: ${sample.department?.code}, DeptID: ${sample.department?._id}`);

            // 3. Group by Dept
            const agg = await Student.aggregate([
                {
                    $group: {
                        _id: "$department",
                        count: { $sum: 1 }
                    }
                }
            ]);
            console.log('Students per Dept ID:', JSON.stringify(agg, null, 2));
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
