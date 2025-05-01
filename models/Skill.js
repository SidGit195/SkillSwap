const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Skill', skillSchema);