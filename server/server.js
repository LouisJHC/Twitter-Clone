const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())

// JSON body parser. Any incoming requests that have content-type as application/json will be parsed by this middleware.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome!');
});

app.post('/tweet', (req, res) => {
    console.log(req.body);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`The server running on port ${PORT}`);
})