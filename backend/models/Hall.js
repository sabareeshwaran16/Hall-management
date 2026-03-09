const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hall name is required'],
        unique: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    building: {
        type: String,
        required: [true, 'Building name is required'],
        trim: true
    },
    floor: {
        type: String,
        required: [true, 'Floor is required'],
        trim: true
    },
    rows: {
        type: Number,
        required: true,
        default: 10
    },
    columns: {
        type: Number,
        required: true,
        default: 6
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Hall', hallSchema);
