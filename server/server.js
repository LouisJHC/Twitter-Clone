const express = require('express');
const app = express();
const cors = require('cors');
const monk = require('monk');

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

app.post('/tweet', (req, res) => {
    if(isValidate(req.body)) {
        const title = req.body.title.toString().trim();
        const content = req.body.content.toString().trim();
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

app.get('/tweet', (req, res) => {
    tweet.find({}).then(docs => {
        res.json(docs);
    });
});

function isValidate(tweet) {
    return tweet.title !== '' && tweet.title.toString().trim() != '' && tweet.content !== '' && tweet.content.toString().trim() !== '';
}
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`The server running on port ${PORT}`);
})