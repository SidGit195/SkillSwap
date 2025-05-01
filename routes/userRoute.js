const express = require('express');
const router = express.Router();
const {getProfile, updateProfile, searchUsers} = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/me', auth, getProfile);

router.patch('/me', auth, updateProfile);

router.get('/search', auth, searchUsers);


module.exports = router;