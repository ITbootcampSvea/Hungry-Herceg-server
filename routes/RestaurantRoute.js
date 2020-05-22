const router = require('express').Router();
const Restaurant = require('../models/Restaurant');
const Meal = require('../models/Meal');

// router middleware

const getDocMeals = async meals => {
    // returns ._doc of object
    return new Promise((resolve, reject) => {
        let newMeals = [];
        meals.forEach((meal, i, arr) => {
            newMeals.push(meal._doc);
            if(arr.length-1 == i){
                resolve(newMeals);
            }
        })
    })
}

const getMeals = async mealIds => {
    return new Promise(async (resolve, reject) => {
        try{
            // the query will ensure I get only meals with the provided list of ids
            const meals = await Meal.find({_id: {$in: mealIds}});
            const filteredMeals = await getDocMeals(meals);
            resolve(filteredMeals);
        } catch(err){
            console.log(err);
        }
    });
}

const prepareRestaurants = async fetchedRestaurants => {
    // fill meals object with meals
    return new Promise((resolve, reject) => {
        let newRestaurants = [];
        fetchedRestaurants.forEach(async (restaurant, index, arr) => {
            const meals = await getMeals(restaurant.meals);
            newRestaurants.push({
                ...restaurant._doc,
                meals: meals
            });
            if(arr.length-1 == index){
                resolve(newRestaurants)
            }
        });
    });
}

// find
router.get('/', async (req, res) => {
    let fetchedRestaurants = await Restaurant.find();
    fetchedRestaurants = await prepareRestaurants(fetchedRestaurants);

    res.json({
        restaurants: [ ...fetchedRestaurants ],
        message: 'Success'
    });
});

// get one
router.get('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    let restaurant;
    try{
        restaurant = await Restaurant.findById(id);
        restaurant = await prepareRestaurants([restaurant]);
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
        savedRestaurant = await prepareRestaurants([savedRestaurant]);
    } catch(err){
        console.log(err);
    }

    res.json({
        restaurant: savedRestaurant[0],
        message: 'Success'
    });
});

// edit
router.put('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    let restaurant;
    try{
        restaurant = await Restaurant.findOneAndUpdate(id, { ...req.body }, {useFindAndModify: false});
        restaurant = await prepareRestaurants([restaurant]);
    } catch(err){
        console.log(err);
    }

    // this should be different
    /*if(!restaurant){
        res.json({
            restaurant: null,
            message: 'Error while editing restaurant'
        });
    }*/

    res.json({
        restaurant: {
            ...restaurant[0]._doc,
            ...req.body,
            meals: restaurant[0].meals
        },
        message: 'Success'
    });
});

// edit
router.patch('/:restaurantId', async (req, res) => {
    const id = req.params.restaurantId;
    let restaurant;
    try{
        restaurant = await Restaurant.findOneAndUpdate(id, { ...req.body }, {useFindAndModify: false});
        restaurant = await prepareRestaurants([restaurant]);
    } catch(err){
        console.log(err);
    }

    // this should be different
    /*if(!restaurant){
        res.json({
            restaurant: null,
            message: 'Error while editing restaurant'
        });
    }*/

    res.json({
        restaurant: {
            ...restaurant[0]._doc,
            ...req.body,
            meals: restaurant[0].meals
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