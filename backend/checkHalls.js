const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hall = require('./models/Hall');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_hall_allocation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to DB');
        const count = await Hall.countDocuments({});
        console.log(`TOTAL HALLS: ${count}`);
        const halls = await Hall.find({});
        halls.forEach(h => console.log(`Hall: ${h.name}, Capacity: ${h.capacity}, Available: ${h.isAvailable}`));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
