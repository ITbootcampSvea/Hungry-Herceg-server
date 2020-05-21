const router = require('express').Router();

// router middleware

// find
router.get('/', (req, res) => {
    res.send('Fetch all orders');
});

// get one
router.get('/:orderId', (req, res) => {
    res.send('Fetch one order with id ' + req.params.orderId);
});

router.post('/', (req, res) => {
    res.send('Create order');
});

// edit
router.put('/:orderId', (req, res) => {
    res.send('Edit order with id ' + req.params.orderId);
});

// edit
router.patch('/:orderId', (req, res) => {
    res.send('Edit order with id ' + req.params.orderId);
});

// delete
router.delete('/:orderId', (req, res) => {
    res.send('Delete order with id ' + req.params.orderId);
});

module.exports = router;