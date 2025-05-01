const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { sendMessage, getConversation, markAsRead} = require('../controllers/messageController');

router.post('/', auth, sendMessage);

router.get('/:userId', auth, getConversation);

router.patch('/:userId/read', auth, markAsRead);

module.exports = router;