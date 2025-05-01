const Skill = require('../models/Skill');
const User = require('../models/User');

exports.getSkills = async (req, res) => {
    try {
        // const skills 
        const skills = await Skill.find().sort({category: 1, name: 1});
        
        res.status(200).json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Internal Server error'});
    }
}

exports.addSkills = async (req, res) => {
    try {
        const { skills } = req.body;

        if(!Array.isArray(skills)){
            return res.status(400).json({msg: 'skills should be an array'});
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { skills: { $each: skills }} },
            {new: true}
        ).select('-password');

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Internal Server error'});
    }
}