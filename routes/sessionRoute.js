const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {getSessions, getSessionById, requestSession, updateSessionStatus } = require('../controllers/sessionController');


router.get('/', auth, getSessions);


router.post('/request', auth, requestSession);

router.patch('/:id/status', auth, updateSessionStatus);
router.get('/:id', auth, getSessionById);


module.exports = router;