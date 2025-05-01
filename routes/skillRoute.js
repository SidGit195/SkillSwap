const express = require('express');
const router = express.Router();
const {getSkills, addSkills} = require('../controllers/skillController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, getSkills);

router.post('/user', auth, addSkills);

module.exports = router;