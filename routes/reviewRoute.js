const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const { createReview, getUserReviews } = require('../controllers/reviewController');

// create a review
router.post('/', auth, createReview);

// get the review of user
router.get('/user/:id', auth, getUserReviews);


module.exports = router;