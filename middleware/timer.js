const Poll = require('../models/Poll');

const getFinishedPolls = polls => {
    return new Promise((resolve, reject) => {
        let finishedPolls = [];
        polls.forEach((poll, i, arr) => {
            const createdAt = new Date(poll.createdAt);
            const currentDate = new Date();
            const minutes = createdAt.getMinutes();
            const hours = createdAt.getHours();

            
            console.log(`Now:${currentDate.getDate()}\nPoll date: ${createdAt.getDate()}\n`);

            // console.log(`${hours}:${minutes}`);

            if(arr.length-1 == i){
                resolve(finishedPolls);
            }
        })
    })
}

module.exports = () => {
    setInterval(async () => {
        const polls = await Poll.find();
        
        const finishedPolls = await getFinishedPolls(polls);
    }, 10000);
}