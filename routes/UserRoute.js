const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// get single user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(user){
        res.json({
            user: {...user._doc},
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
        passworod: hashedPassword,
        history: []
    }

    const createdUser = new User(user);
    
});

module.exports = router;