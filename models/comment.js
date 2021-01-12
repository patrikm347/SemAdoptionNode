const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date_posted: {
        type: Date,
        default: Date.now
    },
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commented_on: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog'
    }
});

CommentSchema.pre('findOneAndDelete', async function(done) {
    const commentId = this.getQuery()['_id'];
    try {
        const comment = await Comment.findById(commentId);
        await mongoose.Model('User').findByIdAndUpdate(comment.commenter, { $pull: { comments_posted: comment } });
        await mongoose.Model('Dog').findByIdAndUpdate(comment.commented_on, { $pull: { comments: comment } });
    } catch (err) {
        console.log(`There has been error deleting comment dog with id ${commentId}` + err);
    }
    done();
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;