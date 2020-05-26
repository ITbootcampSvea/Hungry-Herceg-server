const Poll = require('../models/Poll');
const Order = require('../models/Order');

const getWinnerRestaurant = restaurants => {
    return new Promise((resolve, reject) => {
        const votes = restaurants.map(r => r.votes.length);
        let maxIndex = 0;
        for(let i = 1; i < votes.length; i++){
            if(votes[i] > votes[maxIndex]){
                maxIndex = i;
            }
        }
        resolve(maxIndex);
    });
}

const createOrders = pollIds => {
    // sets Poll to unactive and creates Order
    return new Promise((resolve, reject) => {
        pollIds.forEach(async (id, i, arr) => {
            // update poll
            let dbPoll = await Poll.findById(id);
            await dbPoll.updateOne({status: false});

            // create order
            const winnerIndex = await getWinnerRestaurant(dbPoll.restaurants);
            const order = new Order({
                pollId: id,
                restaurantId: dbPoll.restaurants[winnerIndex].restaurantId,
                createdAt: new Date().toISOString(),
                duration: 20,
                status: true,
                orderItemList: []
            });
            await order.save();

            if(arr.length-1 == i){
                resolve('Success');
            }
        });
    });
}

const getFinishedPolls = polls => {
    // returns list of pollIds that are finished
    return new Promise((resolve, reject) => {
        let finishedPollIds = [];
        polls.forEach((poll, i, arr) => {
            const createdAt = new Date(poll.createdAt);
            const currentDate = new Date();
            const requiredTime = createdAt.getMinutes() * 60 + createdAt.getHours() * 3600 + poll.duration * 60;
            const passedTime = currentDate.getMinutes() * 60 + currentDate.getHours() * 3600;

            // console.log(`Poll name: ${poll.name}\npassedTime: ${passedTime}\nrequiredTime: ${requiredTime}\n`);
            if(currentDate.getDate() > createdAt.getDate() ||
               passedTime >= requiredTime){
                // add finished polls
                finishedPollIds.push(poll._id);
            }

            if(arr.length-1 == i){
                resolve(finishedPollIds);
            }
        });
    });
}

module.exports = () => {
    // ends orders and polls automatically
    setInterval(async () => {
        let polls = await Poll.find();
        
        if(polls.length != 0){
            // get active polls
            polls = await polls.filter(poll => poll.status)
            const finishedPollIds = await getFinishedPolls(polls);
            await createOrders(finishedPollIds);
        }

        // orders...
    }, 10000);
}