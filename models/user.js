const mongoose = require('mongoose');
const { Dog, Breed } = require('./dog');
const Comment = require('./comment');
const validatorJS = require('validator');

const ContactSchema = new mongoose.Schema({
    phone: {
        type: String, 
        required: true,
        validate: {
            validator: function(phone) {
                return validatorJS.isMobilePhone(phone);
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(email) {
                return validatorJS.isEmail(email);
            }
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 100,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 100,
        required: true
    },
    nickName: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    contact: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Contact',
        required: true
    },
    dogs_posted: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dog' 
    }],
    comments_posted: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
    }],
    date_created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('findOneAndDelete', async function(done) {
    const userId = this.getQuery()['_id'];
    try {
        const user = await mongoose.model('User').findById(userId);
        await mongoose.model('Contact').findByIdAndDelete(user.contact);
        user.dogs_posted.forEach(async dog => {
            await mongoose.model('Dog').findByIdAndDelete(dog);
        });
        user.comments_posted.forEach(async comment => {
            await mongoose.model('Dog').findById({ comment: { $in: comments } }, { $pull: { comments: comment } });
            await mongoose.model('Comment').findByIdAndDelete(comment);
        });
    } catch (err) {
        console.log('Problem with removing user ' + err);
    }

    done();
});

const Contact = mongoose.model('Contact', ContactSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
    Contact: Contact,
    User: User
};