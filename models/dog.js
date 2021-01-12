const mongoose = require('mongoose');
const Comment = require('./comment');
const { User } = require('./user');

const BreedSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    originCountry: {
        type: String
    },
    dogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog'
    }]
});

const DogSchema = mongoose.Schema({
    name: {
        type: String,
        //minlength: 2,
        maxlength: 100,
        required: true
    },
    weight: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    },
    age: {
        type: Number,
        min: 0,
        max: 30,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    description: {
        type: String
    },
    date_posted: {
        type: Date,
        default: Date.now
    },
    breed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Breed',
        required: true
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    imageName: {
        type: String,
        required: true
    }
});

DogSchema.pre('findOneAndDelete', async function(done) {
    const dogId = this.getQuery()['_id'];
    try {
        const dog = await mongoose.model('Dog').findById(dogId);
        await mongoose.model('Breed').findByIdAndUpdate(dog.breed, { $pull: { dogs: dog.id } });
        dog.comments.forEach(async comment => {
            await mongoose.model('User').findByIdAndUpdate(dog.poster, { $pull: { comments_posted: comment } });
            await mongoose.model('Comment').findByIdAndDelete(comment);
        });
        await mongoose.model('User').findByIdAndUpdate(dog.poster, { $pull: { dogs_posted: dog.id } });
    } catch (err) {
        console.log('Problem with finding removing breed or comments when removing dog ' + err);
    }
    done();
});

const Breed = mongoose.model('Breed', BreedSchema);
const Dog = mongoose.model('Dog', DogSchema);

module.exports = {
    Breed: Breed,
    Dog: Dog
};