const express = require('express');
const passport = require('passport');

const { checkIfAuthenticated, checkIfNotAuthenticated } = require('../middleware/auth');
const { getRegister, postRegister, getLogin, logout, getProfile, getUpdate, putUpdate, getDeleteConfirm, deleteUser } = require('../controllers/users');

/*const { Dog, Breed } = require('../models/dog');
const Comment = require('../models/comment');*/

const router = express.Router();

/*router.get('/', async (req, res) => {
    const users = await User.find();
    res.render('users/index', { users: users });
});*/

/*router.get('/user/:id', async (req, res) => {
    let user; 
    try {
        user = await User.findById(parseInt(req.params.id));
    } catch (err) {
        res.status(404).send(`User with id ${req.params.id} doesn't exist`);
    }
    //res.render('users/update', { user: user });
});*/

router.get('/register', checkIfNotAuthenticated, getRegister);
router.post('/register', checkIfNotAuthenticated, postRegister);
router.get('/login', checkIfNotAuthenticated, getLogin);
router.post('/login', checkIfNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    successFlash: true
}));
router.delete('/logout', checkIfAuthenticated, logout);
router.get('/profile/:id', getProfile);
router.get('/update/:id', checkIfAuthenticated, getUpdate);
router.put('/update/:id', checkIfAuthenticated, putUpdate);
router.get('/delete/:id', checkIfAuthenticated, getDeleteConfirm);
router.delete('/delete/:id', checkIfAuthenticated, deleteUser);

module.exports = router;