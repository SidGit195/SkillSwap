const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({msg: "user already exist"});
        }

        user = new User({name, email, password});
        await user.save();

        res.status(201).json({msg: "User registered successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Internal server error"});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email });

        if(!user) return res.status(401).json({msg: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(401).json({msg: 'Invalid Credentials'});

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );

        res.status(200).json({msg: 'login successfull', token});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Internal Server Error'});
    }
}

module.exports = {register, login}