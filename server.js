const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');

const indexRoutes = require('./routes/index');

app.set('port', process.env.PORT || 8000);
app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan ('dev'));
app.use(express.urlencoded({extended: false}));

app.use('/', indexRoutes);

app.listen(app.get ('port'), () => {
    console.log(`Listening on port${app.get('port')}`);
});

const dbURI = 'mongodb://localhost/test';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connecting to DB'))
    .catch((err) => console.log(err));