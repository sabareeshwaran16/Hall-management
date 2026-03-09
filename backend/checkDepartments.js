const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./models/Department');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hallAllocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB:', process.env.MONGO_URI || 'mongodb://localhost:27017/hallAllocation');
        const depts = await Department.find({});
        console.log('--- DEPARTMENTS IN DB ---');
        depts.forEach(d => {
            console.log(`Name: "${d.name}", Code: "${d.code}", ID: ${d._id}`);
        });
        console.log('-------------------------');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
