const router = require('express').Router();
const Poll = require('../models/Poll');
const {getResponse, preparePolls, checkForVotes} = require('../helpers');

// router middleware

// find
router.get('/', async (req, res) => {
    try{
        let polls = await Poll.find();

        // validation
        if(polls.length == 0){
            return res.status(200).json(getResponse([], 'Success'));
        }

        polls = await preparePolls(polls);
        return res.status(200).json(getResponse(polls, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// get one
router.get('/:pollId', async (req, res) => {
    try{
        let poll = await Poll.findById(req.params.pollId);
        if(poll){
            poll = await preparePolls([poll]);
            return res.status(200).json(getResponse(poll[0], 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        return res.status(500).json(getResponse(null, err));
    }
});

// create poll
router.post('/', async (req, res) => {
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    const {name, duration, restaurants} = req.body;

    // validation
    if(restaurants.length > 11 || restaurants.length == 0){
        return res.status(400).json(getResponse(null, 'At least one restaurant must be present or not more then 10'));
    }
    if(name == '' || req.user == '' || typeof(duration) != 'number'){
        return res.status(400).json(getResponse(null, 'Bad Request'));
    }

    // time of creating poll
    let currentTime = new Date();

    let pollModel = {
        name: name,
        author: req.user,
        createdAt: currentTime.toISOString(),
        duration: duration,
        status: true,
        restaurants: restaurants.map(id => { return {restaurantId: id, votes: []}})
    }

    // calculating the time when the poll will end
    let minutes = currentTime.getMinutes();
    currentTime.setMinutes(minutes + duration);
    pollModel.ends = currentTime.toISOString();
    
    try{
        // save to db
        const poll = new Poll(pollModel);
        let savedPoll = await poll.save();
        if(savedPoll){
            savedPoll = await preparePolls([savedPoll]);
            return res.status(200).json(getResponse(savedPoll[0], 'Success'));
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
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    // update bi definitivno trebao malo da se doradi
    if(req.body.restaurants == undefined){
        try{
            // findOneAndUpdate wont return new data but same data
            const editedPoll = await Poll.findOneAndUpdate({_id: req.params.pollId}, { ...req.body }, {useFindAndModify: false});
            if(editedPoll){
                return res.status(200).json(getResponse({ ...editedPoll._doc, ...req.body }, 'Success'));
            } else {
                return res.status(404).json(getResponse(null, 'Error while editing poll'));
            }
        } catch(err){
            console.log(err);
            return res.status(500).json(getResponse(null, err));
        }
    } else {
        try{
            const restaurants = req.body.restaurants.map(id => { return {restaurantId: id, votes: []}});
            const editedPoll = await Poll.findOneAndUpdate({_id: req.params.pollId},
            { 
                ...req.body,
                restaurants
            }, {useFindAndModify: false});
            if(editedPoll){
                return res.status(200).json(getResponse({ ...editedPoll._doc, ...req.body, restaurants }, 'Success'));
            } else {
                return res.status(404).json(getResponse(null, 'Error while editing poll'));
            }
        } catch(err){
            console.log(err);
            return res.status(500).json(getResponse(null, err));
        }
    }
});

// delete
router.delete('/:pollId', async (req, res) => {
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    try{
        // brisanje bi trebalo da ima proveru da li je onaj ko je kreirao poll osoba koja pokusava da izbrise poll
        const deletedPoll = await Poll.findByIdAndDelete(req.params.pollId);
        if(deletedPoll){
            return res.status(200).json(getResponse(null, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// vote
router.post('/:pollId/vote', async (req, res) => {
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    // provera da li user nije vec glasao
    // return res.status(200).json(getResponse(null, 'You already voted'));
    
    const pollId = req.params.pollId;
    const restaurantIds = req.body.restaurantId;
    const {userId} = req;
    
    try{
        let poll = await Poll.findById(pollId);
        poll.restaurants = await checkForVotes(poll.restaurants, restaurantIds, userId);
        const savedPoll = await poll.save();
        return res.status(200).json(getResponse(savedPoll, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

module.exports = router;