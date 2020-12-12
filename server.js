if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('static'));

mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', _ => console.log('Successfully connected to database.'));

app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, _ => console.log(`Listening on port ${process.env.PORT}`));