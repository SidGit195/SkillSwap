const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'confirmed', 'completed', 'cancelled'],
        default: 'requested'
    },
    meetingLink: String,
    dateTime: String
});

module.exports = mongoose.model('Session', sessionSchema);