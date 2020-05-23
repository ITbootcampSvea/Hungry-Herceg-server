const router = require('express').Router();
const Poll = require('../models/Poll');
const {getResponse} = require('../helpers');

// router middleware

// find
router.get('/', async (req, res) => {
    try{
        const polls = await Poll.find();
        return res.status(200).json(getResponse(polls, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// get one
router.get('/:pollId', async (req, res) => {
    try{
        const poll = await Poll.findById(req.params.pollId);
        if(poll){
            return res.status(200).json(getResponse(poll, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        return res.status(500).json(getResponse(null, err));
    }
});

// create poll
router.post('/', async (req, res) => {
    const {name, author, duration, restaurants} = req.body;

    // validation
    if(name == '' || author == '' || typeof(duration) != 'number' || restaurants.length == 0){
        return res.status(400).json(getResponse(null, 'Bad Request'));
    }

    // time of creating poll
    let currentTime = new Date();

    let pollModel = {
        name: name,
        author: author,
        createdAt: currentTime.toISOString(),
        duration: duration,
        status: true,
        restaurants: restaurants.map(id => { return {restaurantId: id, votes: 0}})
    }

    // calculating the time when the poll will end
    let minutes = currentTime.getMinutes();
    currentTime.setMinutes(minutes + duration);
    pollModel.ends = currentTime.toISOString();
    
    try{
        // save to db
        const poll = new Poll(pollModel);
        const savedPoll = await poll.save();
        if(savedPoll){
            return res.status(200).json(getResponse(savedPoll._doc, 'Success'));
        } else {
            return res.status(500).json(getResponse(null, 'Error while saving poll'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// edit
router.put('/:pollId', async (req, res) => {
    try{
        // findOneAndUpdate wont return new data but same data
        const editedPoll = await Poll.findOneAndUpdate({_id: req.params.pollId}, { ...req.body }, {useFindAndModify: false});
        if(editedPoll){
            return res.status(200).json(getResponse({ ...editedPoll._doc, ...req.body }, 'Success'));
        } else {
            return res.status(500).json(getResponse(null, 'Error while editing poll'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// edit
router.patch('/:pollId', async (req, res) => {
    try{
        // id, data for update, options
        const poll = await Poll.findOneAndUpdate(req.params.pollId, {...req.body}, {useFindAndModify: false});
        res.json({
            poll: {
                ...poll._doc,
                ...req.body
            },
            message: 'Success'
        })
    } catch(err){
        console.log(err);
    }
});

// delete
router.delete('/:pollId', async (req, res) => {
    try{
        const deletedPoll = await Poll.findByIdAndDelete(req.params.pollId);
        res.json({
            poll: { ...deletedPoll._doc },
            message: 'Success'
        });
    } catch(err){
        console.log(err);
    }
});

// vote

module.exports = router;