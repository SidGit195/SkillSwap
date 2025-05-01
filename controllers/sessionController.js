const Session = require('../models/Session');
const User = require('../models/User');

exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [
                {teacherId: req.user._id},
                {learnerId: req.user._id}
            ]
        }).sort({dateTime: 1});

        res.status(200).json(sessions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal Server Error'});
    }
}

exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        .populate('teacherId', 'name')
        .populate('learnerId', 'name');

        if(!session){
            return res.status(404).json({msg: 'Session not found'});
        }

        if(
            session.teacherId._id.toString() !== req.user._id.toString() &&
            session.learnerId._id.toString() !== req.user._id.toString()
        ){
            return res.status(403).json({msg: 'not authorized'});
        }

        res.status(200).json(session);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Server error'});
    }
}

exports.requestSession = async (req, res) => {
    try {
        const {teacherId, skillName} = req.body;

        const teacher = await User.findById(teacherId);

        // check teacher exist or not
        if(!teacher){
            return res.status(404).json({msg: 'teacher not found'});
        }

        // check teacher has the required skill or not
        if(!teacher.skills.includes(skillName)){
            return res.status(400).json({msg: 'teacher does not have the desired skill'});
        }

        const session = new Session({
            ...req.body,
            learnerId: req.user._id
        });
        
        await session.save();

        res.status(201).json(session);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal server error'});
    }
}

exports.updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if(!['requested', 'confirmed', 'cancelled', 'completed'].includes(status)){
            return res.status(400).json({msg: 'Invalid status'});
        }

        const session = await Session.findById(req.params.id);

        if(!session){
            return res.status(404).json({msg: 'Session not found'});
        }

        // only teacher can confirm/complete sessions
        if((status == 'confirmed' || status == 'completed') && (session.teacherId.toString() !== req.user._id.toString())){
            return res.status(403).json({msg: 'Forbiden status'});
        }

        // only teacher and learner can cancelled
        if(status == 'cancelled' && session.teacherId.toString() !== req.user._id && session.learnerId.toString() !== req.user._id){
            return res.status(403).json({msg: 'Unauthorized'});
        }
        
        session.status = status;
        await session.save();

        res.status(200).json(session);
    } catch(error) {
        console.error(error.message);
        res.status(500).json({msg: 'Server Error'});
    }
}