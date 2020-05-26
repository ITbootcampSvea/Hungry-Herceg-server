const Poll = require('../models/Poll');
const Order = require('../models/Order');

const getWinnerRestaurant = restaurants => {
    const votes = restaurants.map(r => r.votes.length);
    let maxIndex = 0;
    for(let i = 1; i < votes.length; i++){
        if(votes[i] > votes[maxIndex]){
            maxIndex = i;
        }
    }
    return maxIndex;
}

const createOrders = pollIds => {
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
    return new Promise((resolve, reject) => {
        let pollIds = [];
        polls.forEach((poll, i, arr) => {
            const createdAt = new Date(poll.createdAt);
            const currentDate = new Date();
            const requiredTime = createdAt.getMinutes() * 60 + createdAt.getHours() * 3600 + poll.duration * 60;
            const passedTime = currentDate.getMinutes() * 60 + currentDate.getHours() * 3600;

            if(currentDate.getDate() > createdAt.getDate() ||
               passedTime >= requiredTime){
                pollIds.push(poll._id);
            }

            if(arr.length-1 == i){
                resolve(pollIds);
            }
        });
    });
}

module.exports = () => {
    setInterval(async () => {
        let polls = await Poll.find();
        polls = await polls.filter(poll => poll.status)
        
        if(polls.length != 0){
            const pollIds = await getFinishedPolls(polls);
            await createOrders(pollIds);
        }

        // orders...
    }, 10000);
}