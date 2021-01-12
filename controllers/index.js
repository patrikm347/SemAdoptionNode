const { Dog, Breed } = require('../models/dog');

const getDogs = async (req, res) => {
    try {
        const searchedBreed = req.query.breed && req.query.breed !== 'Any' ? await Breed.findOne({ name: req.query.breed }) : null;
        //const searchedName = req.query.name ? new RegExp(`^${req.query.name}`) : new RegExp('.*?');
        const searchedDogParameters = {};

        if (req.query.name) {
            searchedDogParameters.name = new RegExp(`^${req.query.name}`);
        }
        if (req.query.age) {
            searchedDogParameters.age = { $lte: req.query.age }
        }
        if (searchedBreed) {
            searchedDogParameters.breed = searchedBreed.id;
        }

        const dogs = await Dog.find(searchedDogParameters);
        const breeds = await Breed.find().sort({ name: 1 });

        res.render('index.ejs', { dogs, breeds });
    } catch (err) {
        console.log('Could not load dogs ' + err);
    }
}

module.exports = {
    getDogs
}