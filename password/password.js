const bcrypt = require('bcrypt');
const { User, Contact } = require('../models/user');

async function hashPassword(password) {
    try {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    } catch (err) {
        console.log('Something went wrong hashing password.' + err);
    }
}

async function comparePasswords(req, email, password, done) {
    let user;
    console.log();
    try {
        const contact = await Contact.findOne({ email });
        await contact.populate('user').execPopulate(); 
        user = contact.user;
    } catch (err) {
        return done(null, false, req.flash('errors', 'User with this email doesn\'t exist'));
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user, req.flash('success', 'You have been logged in successfully!'));
        } else {
            return done(null, false, req.flash('errors', 'Provided password is not correct.'));
        }
    } catch (err) {
        return done(err);
    }
};

module.exports = {
    hashPassword,
    comparePasswords
}