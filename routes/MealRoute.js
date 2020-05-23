const router = require('express').Router();
const Meal = require('../models/Meal');

const {getResponse} = require('../helpers/index');

// find
router.get('/', async (req, res) => {
    try{
        const meals = await Meal.find();
        return res.status(200).json(getResponse(meals, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// get one
router.get('/:mealId', async (req, res) => {
    const {mealId} = req.params;
    try{
        const meal = await Meal.findById(mealId);
        if(meal){
            return res.status(200).json(getResponse(meal, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'))
        }
    } catch(err){
        console.log(err);
        return res.status(400).json(getResponse(null, err));
    }
});

router.post('/', async (req, res) => {
    const {name, price, tag} = req.body;

    // input validation - should create func for this
    if(name == '' || tag == ''){
        return res.status(400).json(getResponse(null, 'Bad Request'));
    }
    
    try{
        const meal = new Meal({
            name: name,
            price: price,
            tag: tag
        });
        // save to db
        savedMeal = await meal.save();
        // send result
        return res.status(200).json(getResponse(savedMeal._doc, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(400).json(getResponse(null, err));
    }
});

// edit
router.put('/:mealId', async (req, res) => {
    const {name, price, tag} = req.body;
    if(name == '' || tag == ''){
        return res.status(400).json(getResponse(null, 'Bad Request'));
    }
    
    try{
        const id = req.params.mealId;
        const meal = await Meal.findOneAndUpdate({_id: id}, { ...req.body }, {useFindAndModify: false});
        if(meal){
            return res.status(200).json(getResponse({ ...meal._doc, ...req.body }, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        return res.status(400).json(getResponse(null, err));
    }
});

// edit
router.patch('/:mealId', async (req, res) => {
    const {name, price, tag} = req.body;
    if(name == '' || tag == ''){
        return res.status(400).json(getResponse(null, 'Bad Request'));
    }
    
    try{
        const id = req.params.mealId;
        const meal = await Meal.findOneAndUpdate({_id: id}, { ...req.body }, {useFindAndModify: false});
        if(meal){
            return res.status(200).json(getResponse({ ...meal._doc, ...req.body }, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        return res.status(400).json(getResponse(null, err));
    }
});

// delete
router.delete('/:mealId', async (req, res) => {
    try{
        const deletedMeal = await Meal.findByIdAndDelete(req.params.mealId);
        if(deletedMeal){
            return res.status(200).json(getResponse(deletedMeal._doc, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        res.status(400).json(getResponse(null, err));
    }
});

module.exports = router;