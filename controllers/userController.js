const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal server error'});
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const {name, bio, skills, interests} = req.body;

        const updateFields = {};
        if(name) updateFields.name = name;
        if(bio) updateFields.bio = bio;
        if(skills) updateFields.skills = skills;
        if(interests) updateFields.interests = interests;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {$set: updateFields},
            {new: true}
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: "Internal server error"});
    }
}


// search by skills
exports.searchUsers = async (req, res) => {
    try {
        const {skill} = req.query;

        const query = skill ? {skills: {$in: [skill]}} : {};

        const users = await User.find(query).select('name bio interests skills').limit(10);

        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal Server error'});
    }
}