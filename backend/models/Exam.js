const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exam name is required'],
        trim: true
    },
    examDate: {
        type: Date,
        required: [true, 'Exam date is required']
    },
    session: {
        type: String,
        enum: ['FN', 'AN'],
        required: [true, 'Session is required']
    },
    subjects: [{
        subject: {
            type: String,
            required: true
        },
        subjectCode: {
            type: String,
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }
    }],
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    status: {
        type: String,
        enum: ['scheduled', 'allocated', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    duration: {
        type: Number,
        default: 180 // in minutes
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
