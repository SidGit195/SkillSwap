const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    bio: String,

    skills: [String],

    interests: [String],

    average_rating: {
        type: Number,
        default: 0
    },
},
{
    timestamps: true
}
);


// hash the password before save
userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();                   // if password not change --> no need to hash

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
