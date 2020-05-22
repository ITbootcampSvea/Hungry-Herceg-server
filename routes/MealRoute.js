const router = require('express').Router();
const Meal = require('../models/Meal');

// find
router.get('/', async (req, res) => {
    const meals = await Meal.find();
    res.json({
        meals,
        message: 'Success'
    });
});

// get one
router.get('/:mealId', async (req, res) => {
    const id = req.params.mealId;
    let meal;
    try{
        meal = await Meal.findById(id);
        res.json({
            meal,
            message: 'Success'
        });
    } catch(err){
        res.status(400).json({
            message: 'Meal doesnt exist'
        });
    }
});

router.post('/', async (req, res) => {
    let meal = {
        name: req.body.name,
        price: req.body.price,
        tag: req.body.tag
    }
    
    // save to db
    const createdMeal = new Meal(meal);
    let savedMeal;
    try{
        savedMeal = await createdMeal.save();
    } catch(err){
        console.log(err);
    }

    // send result
    res.json({
        meal: {
            ...savedMeal._doc
        },
        message: 'Success'
    });
});

// edit
router.put('/:mealId', async (req, res) => {
    const id = req.params.mealId;
    let meal;

    try{
        meal = await Meal.findOneAndUpdate(id, { ...req.body }, {useFindAndModify: false});
    } catch(err){
        console.log(err);
    }

    res.json({
        meal: {
            ...meal._doc,
            ...req.body
        },
        message: 'Success'
    });
});

// edit
router.patch('/:mealId', async (req, res) => {
    const id = req.params.mealId;
    let meal;

    try{
        meal = await Meal.findOneAndUpdate(id, { ...req.body }, {useFindAndModify: false});
    } catch(err){
        console.log(err);
    }

    res.json({
        meal: {
            ...meal._doc,
            ...req.body
        },
        message: 'Success'
    });
});

// delete
router.delete('/:mealId', async (req, res) => {
    let deletedMeal;
    try{
        deletedMeal = await Poll.findByIdAndDelete(req.params.mealId);
    } catch(err){
        console.log(err);
    }

    res.json({
        meal: { ...deletedMeal._doc },
        message: 'Success'
    });
});

module.exports = router;