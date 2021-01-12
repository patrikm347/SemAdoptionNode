const fs = require('fs');

const { Dog, Breed } = require('../models/dog');
const { User, Contact } = require('../models/user');
const { validateCreateDogData } = require('../validation/validateDogData');

const getDog = async (req, res) => {
    let dog;
    try {
        dog = await Dog.findById(req.params.id);
        await dog.populate('breed').execPopulate();
        await dog.populate('poster').execPopulate();
    } catch (err) {
        console.log('Could not find dog with this id ' + err);
        req.flash('errors', 'Could not find dog with this id');
        res.redirect('/');
    }

    res.render('dogs/detail', { dog });
};

const getDogsByUser = async (req, res) => {
    let dogs;
    try {
        dogs = await Dog.find({ poster: req.user.id });
    } catch (err) {
        res.redirect('/');
    }
    res.render('dogs/users_dogs', { dogs });
};

const getNewDog = async (req, res) => {
    const breeds = await getBreeds();
    res.render('dogs/create', { dog: new Dog(), breeds, errors: {} });
};

const postNewDog = async (req, res) => {
    const breeds = await getBreeds();
    const validateErrors = validateCreateDogData(req.body, req.file, breeds);
    if (Object.keys(validateErrors).length !== 0) {
        if (req.file) {
            fs.unlink(`public/images/dogs/${req.file.filename}`, (err) => {
                if (err) {
                    console.log('Problem with deleting file after unsuccessful dog creation');
                }
            });
        }
        return res.render('dogs/create', { dog: req.body, breeds, errors: validateErrors });
    }

    const dog = new Dog({
        name: req.body.name,
        weight: req.body.weight,
        age: req.body.age,
        gender: req.body.gender,
        description: req.body.description,
        imageName: req.file.filename,
        poster: req.user.id
    });

    try {
        const breed = await Breed.findOneAndUpdate({ name: req.body.breed }, { $push: { dogs: dog.id } });
        dog.breed = breed.id;
        await User.findByIdAndUpdate(req.user.id, { $push: { dogs_posted: dog.id } });
        const newDog = await dog.save();
        res.redirect(`/dogs/user/${req.user.id}`);
    } catch (err) {
        console.log(err);
        res.render('dogs/create', { dog: req.body, breeds, errors: validateErrors });
    }
};

const getUpdateDog = async (req, res) => {
    let dog, breeds;
    try {
        breeds = await Breed.find({}, 'name' ).sort({ name: 1 });
        dog = await (await Dog.findById(req.params.id)).populate('breed').execPopulate();
        dog.breed = dog.breed.name;
    } catch (err) {
        req.flash('There was an error finding dog in dog update');
        red.redirect('/');
    }

    res.render('dogs/update', { dog, breeds, errors: {} });
};

const putUpdateDog = async (req, res, next) => {
    const breeds = await getBreeds();

    req.body.id = req.params.id;

    const validateErrors = validateCreateDogData(req.body, null, breeds);
    if (Object.keys(validateErrors).length > 1) {
        res.render('dogs/update', { dog: req.body, breeds, errors: validateErrors });
        return next();
    }

    let dog;
    try {
        const breed = await Breed.findOneAndUpdate({ name: req.body.breed }, { $push: { dogs: req.params.id } });
        dog = await Dog.findById(req.params.id);
        await Breed.findByIdAndUpdate(dog.breed, { $pull: { dogs: req.params.id } });
        await Dog.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            weight: req.body.weight,
            age: req.body.age,
            gender: req.body.gender,
            description: req.body.description,
            breed: breed.id
        });
        return res.redirect(`/dogs/dog/${req.params.id}`);
    } catch (err) {
        console.log('Error updating dog ' + err);
        req.flash('errors', 'There was an error updating dog');
        return res.redirect('/');
    }
};

const confirmDeleteDog = async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id);
        res.render('dogs/delete_confirm', { dog });
    } catch (err) {
        req.flash('Could not find dog to delete');
        return res.redirect('/');
    }
};

const deleteDog = async (req, res) => {
    try {
        const dog = await Dog.findByIdAndDelete(req.params.id);
        fs.unlink(`public/images/dogs/${dog.imageName}`, (err) => {
            if (err) {
                console.log('Problem with deleting file after dog delete');
            }
        });
        req.flash('errors', 'Dog has been deleted');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('errors', 'There has been an error, could not delete dog');
        res.redirect('/');
    }
};

async function getBreeds() {
    try {
        return await Breed.find({}, 'name');
    } catch (err) {
        console.log('Could not load breeds ' + err);
        return next();
    }
}

module.exports = {
    getDog,
    getDogsByUser,
    getNewDog,
    postNewDog,
    getUpdateDog,
    putUpdateDog,
    confirmDeleteDog,
    deleteDog
}