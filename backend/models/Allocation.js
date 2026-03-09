const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    row: {
        type: Number,
        required: true
    },
    column: {
        type: Number,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure unique seat allocation per exam
allocationSchema.index({ exam: 1, hall: 1, seatNumber: 1 }, { unique: true });
allocationSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Allocation', allocationSchema);
