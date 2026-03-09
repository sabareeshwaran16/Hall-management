const mongoose = require('mongoose');

const invigilatorSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
    },
    role: {
        type: String,
        enum: ['chief', 'assistant'],
        default: 'assistant'
    }
}, {
    timestamps: true
});

// Ensure unique faculty assignment per exam and hall
invigilatorSchema.index({ faculty: 1, exam: 1, hall: 1 }, { unique: true });

module.exports = mongoose.model('Invigilator', invigilatorSchema);
