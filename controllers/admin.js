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

const postBreed = async (req, res) => {
    try {
        const breed = new Breed({ name: req.body.breedName, originCountry: req.body.originCountry });
        await breed.save();
    } catch (err) {
        console.log('Could not save new breed');
    }

    res.redirect('/admin');
}

 /*const deleteBreed = async (req, res) => {

 }*/

module.exports = {
    getAdminData,
    deleteUser,
    postBreed,
    //deleteBreed
}