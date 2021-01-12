const { Breed } = require('../models/dog');
const { User } = require('../models/user');

const getAdminData = async (req, res) => {
    try {
        const users = await User.find().populate('contact').exec();

        res.render('admin', { users });
    } catch (err) {
        console.log('Problem with getting users for admin page: ' + err);
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
    } catch (err) {
        console.log('User couldn\'t be deleted');
    }

    res.redirect('/admin');
}

module.exports = {
    getAdminData,
    deleteUser
}