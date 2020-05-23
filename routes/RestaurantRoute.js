const router = require('express').Router();
const Restaurant = require('../models/Restaurant');
const Meal = require('../models/Meal');
const {getResponse} = require('../helpers');

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

            if(meals == 0){
                resolve([]);
            }

            const filteredMeals = await getDocMeals(meals);
            resolve(filteredMeals);
        } catch(err){
            console.log(err);
            reject(err);
        }
    });
}

const prepareRestaurants = async fetchedRestaurants => {
    // fill meals object with meals
    return new Promise((resolve, reject) => {
        let newRestaurants = [];
        fetchedRestaurants.forEach(async (restaurant, index, arr) => {
            try{
                const meals = await getMeals(restaurant.meals);
            
                newRestaurants.push({
                    ...restaurant._doc,
                    meals: meals
                });
                
                if(arr.length-1 == index){
                    resolve(newRestaurants)
                }
            } catch(err){
                console.log(err);
                reject(err);
            }
        });
    });
}

// find
router.get('/', async (req, res) => {
    try{
        let fetchedRestaurants = await Restaurant.find();
        
        if(fetchedRestaurants.length == 0){
            return res.status(200).json(getResponse([], 'Success'));
        }
        
        fetchedRestaurants = await prepareRestaurants(fetchedRestaurants);
        return res.status(200).json(getResponse([...fetchedRestaurants], 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, 'Server Error'));
    }
});

// get one
router.get('/:restaurantId', async (req, res) => {
    try{
        let restaurant = await Restaurant.findById(req.params.restaurantId);
        restaurant = await prepareRestaurants([restaurant]);
        return res.json(getResponse(restaurant[0], 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// create
router.post('/', async (req, res) => {
    if(req.body.name == '' || req.body.address == ''){
        return res.status(400).json(getResponse(null, 'Bad Request'));
    }
    
    const restaurant = new Restaurant({
        name: req.body.name,
        address: req.body.address,
        tags: req.body.tags,
        meals: req.body.meals
    });

    try{
        const savedRestaurant = await restaurant.save();
        return res.status(200).json(getResponse(savedRestaurant._doc, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// edit
router.put('/:restaurantId', async (req, res) => {
    try{
        let restaurant = await Restaurant.findOneAndUpdate({_id: req.params.restaurantId}, { ...req.body }, {useFindAndModify: false});
        restaurant = await prepareRestaurants([restaurant]);
        return res.status(200).json(getResponse({ ...restaurant[0], ...req.body }, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// edit
router.patch('/:restaurantId', async (req, res) => {
    try{
        let restaurant = await Restaurant.findOneAndUpdate({_id: req.params.restaurantId}, { ...req.body }, {useFindAndModify: false});
        restaurant = await prepareRestaurants([restaurant]);
        return res.status(200).json(getResponse({ ...restaurant[0], ...req.body }, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// delete
router.delete('/:restaurantId', async (req, res) => {
    try{
        const id = req.params.restaurantId;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
        if(deletedRestaurant){
            return res.status(200).json(getResponse(deletedRestaurant._doc, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

module.exports = router;