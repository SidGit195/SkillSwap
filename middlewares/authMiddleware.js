const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if(!token){
            return res.status(401).json({msg: 'token not found, authorization denied'});
        }

        // decode
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // FIND user
        const user = await User.findById(decoded.userId).select('-password');

        if(!user){
            return res.status(401).json({msg: 'User not found'});
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error: ', error.message);
        res.status(401).json({msg: 'Token is not valid'});
    }
};