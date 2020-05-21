const router = require('express').Router();
const Restaurant = require('../models/Restaurant');

// router middleware

// find
router.get('/', async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json({
        restaurants,
        message: 'Success'
    });
});

// get one
router.get('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    let restaurant;
    try{
        restaurant = await Restaurant.findById(id);
    } catch(err){
        res.json({
            message: 'Poll doesnt exist',
            error: err
        })
    }
    res.json({
        restaurant,
        message: 'Success'
    });
});

// create
router.post('/', async (req, res) => {
    let restaurant = {
        name: req.body.name,
        address: req.body.address,
        tags: req.body.tags,
        meals: req.body.meals
    }
    
    const createdRestaurant = new Restaurant(restaurant);
    let savedRestaurant;
    try{
        savedRestaurant = await createdRestaurant.save();
    } catch(err){
        console.log(err);
    }

    res.json({
        restaurant:{
            ...savedRestaurant._doc
        },
        message: 'Success'
    });
});

// edit
router.put('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    console.log(id);
    let restaurant;
    try{
        restaurant = await Restaurant.findOneAndUpdate(id, {
            ...req.body
        }, {useFindAndModify: false});
    } catch(err){
        console.log(err);
    }

    if(!restaurant){
        res.json({
            restaurant: null,
            message: 'Error while editing restaurant'
        });
    }

    res.json({
        restaurant: {
            ...restaurant._doc,
            ...req.body
        },
        message: 'Success'
    });
});

// edit
router.patch('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    let restaurant;
    try{
        restaurant = await Restaurant.findOneAndUpdate(id, {
            ...req.body
        }, {useFindAndModify: false});
    } catch(err){
        console.log(err);
    }

    res.json({
        restaurant: {
            ...restaurant._doc,
            ...req.body
        },
        message: 'Success'
    });
});

// delete
router.delete('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    let deletedRestaurant;
    try{
        deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    } catch(err){
        console.log(err);
    }
    res.json({
        restaurant: { ...deletedRestaurant._doc },
        message: 'Success'
    });
});

module.exports = router;