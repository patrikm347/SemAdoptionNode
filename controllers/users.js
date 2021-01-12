const { hashPassword } = require('../password/password');
const { validateProfileData } = require('../validation/validateUserData');
const { User, Contact } = require('../models/user');

const getRegister = (req, res) => {
    res.render('users/register', { newUser: new User(), errors: {} }); // || [] is important
}

const postRegister = async (req, res) => {
    const validationErrors = validateProfileData(req.body);
    if (Object.keys(validationErrors).length !== 0) {
        return res.render('users/register', { newUser: req.body, errors: validationErrors });
    }

    if (await checkIfEmailExists(req.body.email)) {
        validationErrors.email = 'User with this email already exists';
        return res.render('users/register', { newUser: req.body, errors: validationErrors });
    }

    if (await checkIfNicknameExists(req.body.nickName)) {
        validationErrors.nickName = 'User with this nick name already exists';
        return res.render('users/register', { newUser: req.body, errors: validationErrors });
    }

    req.body.birthday = new Date(req.body.birthday);

    let contact = new Contact({
        email: req.body.email,
        phone: req.body.phone.toString()
    });

    const password = await hashPassword(req.body.password);
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: req.body.nickName,
        password: password,
        birthday: req.body.birthday,
        gender: req.body.gender
    });

    contact.user = user.id;
    user.contact = contact.id;

    try {
        contact = await contact.save();
        user = await user.save();
        req.flash('success', 'You have been successfully registered');

        res.redirect('/users/login');
    } catch (err) {
        console.log('Could not save user: ' + err);
        req.flash('errors', 'There has been problem with registration');
        res.redirect('/');
    }
}

const getLogin = (req, res) => {
    //const errors = req.flash('errors') || [];
    res.render('users/login', { user: new User(), errors: {} });
}

const logout = (req, res) => {
    req.logOut();
    req.flash('success', 'You have been logged out');
    res.redirect('/users/login');
}

const getProfile = async (req, res) => {
    try {
        const observedUser = await (await User.findById(req.params.id).populate('contact')).execPopulate();
        res.render('users/profile', { observedUser });
    } catch (err) {
        console.log('Problem with getting user for profile');
    }
}

const getUpdate = async (req, res) => {
    try {
        const user = await req.user.populate('contact').execPopulate();
        user.phone = user.contact.phone;
        user.email = user.contact.email;

        res.render('users/update',  { newUser: user, errors: {} });
    } catch (err) {
        console.log('There was an error fetching update data ' + err);
        req.flash('errors', 'There has been a problem with loading profile');
        res.redirect('/');
    }
}

const putUpdate = async (req, res) => {
    const validationErrors = validateProfileData(req.body);

    if (Object.keys(validationErrors).length !== 0) {
        return res.render('users/update', { newUser: req.body, errors: validationErrors });
    }

    req.user = await req.user.populate('contact').execPopulate();

    if (req.user.contact.email !== req.body.email && await checkIfEmailExists(req.body.email)) {
        validationErrors.email = 'User with this email already exists';
        return res.render('users/update', { newUser: req.body, errors: validationErrors });
    }

    if (req.user.nickName !== req.body.nickName && await checkIfNicknameExists(req.body.nickName)) {
        validationErrors.nickName = 'User with this nick name already exists';
        return res.render('users/update', { newUser: req.body, errors: validationErrors });
    }

    try {
        await User.findByIdAndUpdate(req.user.id, { 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickName: req.body.nickName,
            birthday: new Date(req.body.birthday),
            gender: req.body.gender
        });
        await Contact.findByIdAndUpdate(req.user.contact, {
            email: req.body.email,
            phone: req.body.phone.toString()
        });
        
        req.flash('success', 'Profile has been updated');
        res.redirect(`/users/profile/${req.user.id}`);
    } catch (err) {
        console.log('There has been problem updating user profile: ' + err);
        req.flash('errors', 'There has been problem updating user profile');
        res.redirect('/');
    }
}

const getDeleteConfirm = (_, res) => {
    res.render('users/delete_confirm');
}

const deleteUser = async (req, res) => {
    req.logOut();

    try {
        await User.findByIdAndDelete(req.params.id);
        req.flash('errors', 'Your account has been deleted');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('errors', 'There has been an error, could not delete your account');
        res.redirect('/');
    }
}

async function checkIfNicknameExists(nickName) {
    try {
        const oldUser = await User.findOne({ nickName });
        return oldUser ? true : false;
    } catch (err) {
        console.log('Problem with checking if nickname exists: ' + err);
        return true;
    }
}

async function checkIfEmailExists(email) {
    try {
        const oldContact = await Contact.findOne({ email });
        return oldContact ? true : false;
    } catch (err) {
        console.log('Problem with checking if email exists: ' + err);
        return true;
    }
}

module.exports = {
    getRegister,
    postRegister,
    getLogin,
    logout,
    getUpdate,
    putUpdate,
    getDeleteConfirm,
    deleteUser,
    getProfile
}