var http = require("http"),
//axios = require("axios"),
logger = require('morgan'),
cors = require('cors'),
express = require('express'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
exphbs = require('express-handlebars');

var app = express();
var port = 8000;

//Middleware
app.use(bodyParser.json());
app.use(logger('tiny'));
app.use(require('./routes'));

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port, function(err) {
    console.log('Listening port: ' + port);
});

const dbURI = 'mongodb://localhost/test';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connecting to DB'))
    .catch((err) => console.log(err));