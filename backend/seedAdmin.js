const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'xyz@gmail.com' });

        if (adminExists) {
            console.log('Admin user already exists');

            // Optional: Update password just in case
            adminExists.password = '123456';
            await adminExists.save();
            console.log('Admin password updated to 123456');

        } else {
            console.log('Creating admin user...');
            await User.create({
                name: 'Admin User',
                email: 'xyz@gmail.com',
                password: '123456',
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }

        console.log(' credentials:');
        console.log('Email: xyz@gmail.com');
        console.log('Password: 123456');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedAdmin();
