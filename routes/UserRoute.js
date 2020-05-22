const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// get single user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(user){
        res.json({
            user: {...user._doc, password: null},
            message: 'Success'
        });
    } else {
        res.json({
            message: 'User does not exist'
        });
    }
});

// create user
router.post('/', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = {
        username: req.body.username,
        password: hashedPassword,
        history: []
    };

    const createdUser = new User(user);
    const savedUser = await createdUser.save();
    if(savedUser){
        res.json({
            user: {...savedUser._doc, password: null},
            message: 'Success'
        });
    } else {
        res.json({message: 'Error'});
    }
});

router.post('/login', async (req, res) => {
    const {username} = req.body;
    const {password} = req.body

    // prvo pronalazimo usera
    const user = await User.findOne({username: username});
    if(!user){
        res.json({
            message: 'Wrong credentials'
        })
    }

    // proveravamo dali je password tacan
    let passwordMatch;
    try{
        passwordMatch = await bcrypt.compare(password, user.password);
    } catch(err){
        console.log(err);
    }
    
    if(passwordMatch){
        // pravimo token i saljemo
        // 
        const token = await jwt.sign({userId: user._id, username: user.username}, 'secretkey');
        res.json({
            token,
            message: 'Success'
        });
    } else {
        // ne valja input
        res.status(401).json({
            user: null,
            message: 'Wrong credentials'
        });
    }
});

module.exports = router;