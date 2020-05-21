const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

const auth = require('./middleware/auth');
const PollRoute = require('./routes/PollRoute');

// middlewares
app.use(express.json());
app.use(auth);

// useless interval
/*let i = 0;
setInterval(() => {
    console.log(i);
    i++;   
}, 1000);*/

app.use('/poll', PollRoute);

// connect to mongodb cluster
mongoose.connect(`mongodb+srv://nikolahot:pasteta@mydb-x0kvb.mongodb.net/hunry-herceg?retryWrites=true&w=majority`,
{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(res => {
    app.listen(port, (req, res) => {
        console.log(`Server started on port ${port}`);
    });
})
.catch(err => {
    console.log(err);
});