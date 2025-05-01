const Review = require("../models/Review");
const Session = require("../models/Session");

exports.createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    // check for session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    if (session.status !== "completed") {
      return res
        .status(400)
        .json({ msg: "Session not completed yet, you can not rate" });
    }

    // check user is part of session
    if (session.learnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Access Forbidden" });
    }

    const existingReview = await Review.findOne({
      sessionId,
      recieverId: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ msg: "You have already reviewed the session" });
    }

    // create review
    const review = new Review({
      sessionId,
      teacherId: session.teacherId,
      recieverId: req.user._id,
      rating,
      comment,
    });

    await review.save();

    // Update teacher's average rating
    const reviews = await Review.find({ teacherId: session.teacherId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await User.findByIdAndUpdate(session.teacherId, {
      average_rating: averageRating.toFixed(1),
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const reviews = await Review.find({ teacherId: userId })
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
