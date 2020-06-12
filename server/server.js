const express = require('express');
const app = express();
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const url = 'localhost:27017/acme'
const db = monk(url);

const tweet = db.get('tweet');
db.then(() => {
    console.log('connected!');
});



app.use(cors())
// JSON body parser. Any incoming requests that have content-type as application/json will be parsed by this middleware.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome!');
});


app.get('/tweet', (req, res) => {
    tweet.find({}).then(docs => {
        res.json(docs);
    });
});

function isValid(tweet) {
    return tweet.title !== '' && tweet.title.toString().trim() != '' && tweet.content !== '' && tweet.content.toString().trim() !== '';
}


// only allow 1 request every 15 seconds.
const limiter = rateLimit({
    windowMs: 15 * 1000,
    max: 1
})

// app.use(limiter) should be put here, so whenever the request comes in, it goes through the cors middleware first, then json parser, etc.
// So when the get request comes in for the /tweet, it will hit that url first and then it hits the limiter, which is what I want.
// I want to put the limit on the posting of the tweet, not necessarily the get request.
app.use(limiter);
const customizedFilter = new Filter( { placeHolder: '@'});
app.post('/tweet', (req, res) => {
    if(isValid(req.body)) {
        const title = customizedFilter.clean(req.body.title.toString().trim());
        const content = customizedFilter.clean(req.body.content.toString().trim());
        const createdAt = new Date();

        tweet.insert({title, content, createdAt}).then(tweet =>
            res.send(tweet));
    } else {
        res.status(422)
        res.json({
            message: 'Please enter a valid title and content!'
        })
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`The server running on port ${PORT}`);
})