require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dogsRouter = require('./routes/dogs');
const commentsRouter = require('./routes/comments');
const adminRouter = require('./routes/admin');

const { comparePasswords } = require('./password/password');
const { User } = require('./models/user');

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(session({
    secret: 'This is my secret that will encrypt things in session, I should probably put this in .env file...',
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, comparePasswords));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => done(null, await User.findById(id))); 
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //instead of path.join -> __dirname + '/views
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated(); //locals is render context
    res.locals.flashErrors = req.flash('errors') || [];
    res.locals.flashSuccess = req.flash('success') || [];
    next();
});

mongoose.connect('mongodb://localhost:27017/adoption', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.once('open', _ => console.log('Successfully connected to database.'));
db.on('error', _ => console.log('Could not connect to database.'))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dogs', dogsRouter);
app.use('/comments', commentsRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT || 3000, _ => console.log(`Open on port ${process.env.PORT}`));