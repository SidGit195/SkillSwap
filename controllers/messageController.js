const User = require('../models/User');
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const {recieverId, content} = req.body;

        // check if reciever exists
        const reciever = await User.findById(recieverId);

        if(!reciever){
            return res.status(404).json({msg: 'Reciever not found'});
        }

        const message = new Message({senderId: req.user._id, recieverId, content});

        await message.save();

        res.status(201).json({msg: 'message send successfully', message});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal server error'});
    }
};

exports.getConversation = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }

        // find message b/w user and reciever
        const messages = await Message.find({
            $or: [
                {senderId: req.user._id, recieverId: userId},
                {senderId: userId, recieverId: req.user._id}
            ]
        }).sort({ createdAt: 1});

        res.status(200).json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal Server error'});
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const senderId = req.params.userId;

        const message = await Message.updateMany(
            {
                senderId,
                recieverId: req.user._id,
                isRead: false
            },
            {$set: { isRead: true }}
        );

        res.status(200).json({msg: 'Message mark as read'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal server error'});
    }
};