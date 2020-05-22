const router = require('express').Router();
const Poll = require('../models/Poll');

// router middleware

// find
router.get('/', async (req, res) => {
    let polls;
    try{
        polls = await Poll.find();
        
    } catch(err){
        console.log(err);
    }

    res.json({
        polls,
        message: 'Success'
    });
});

// get one
router.get('/:pollId', async (req, res) => {
    const id = req.params.pollId;
    let poll;
    try{
        poll = await Poll.findById(id);
    } catch(err){
        res.json({
            message: 'Poll doesnt exist'
        })
    }
    res.json({
        poll,
        message: 'Success'
    });
});

router.post('/', async (req, res) => {
    // create poll

    /*
    *   add some validation
    */

    // time of creating poll
    let currentTime = new Date();

    let poll = {
        name: req.body.name,
        author: req.body.author,
        createdAt: currentTime.toISOString(),
        duration: req.body.duration,
        status: true,
        restaurants: req.body.restaurants
    }

    // calculating the time when the poll will end
    let minutes = currentTime.getMinutes();
    currentTime.setMinutes(minutes + req.body.duration);
    poll.ends = currentTime.toISOString();
    
    // save to db
    const createdPoll = new Poll(poll);
    let savedPoll;
    try{
        savedPoll = await createdPoll.save();
    } catch(err){
        console.log(err);
    }

    // send result
    res.json({
        poll:{
            ...savedPoll._doc
        },
        message: 'Success'
    });
});

// edit
router.put('/:pollId', async (req, res) => {
    try{
        // findOneAndUpdate wont return new data but same data
        const poll = await Poll.findOneAndUpdate(req.params.pollId, {
            ...req.body
        }, {useFindAndModify: false});
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