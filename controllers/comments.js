const Comment = require('../models/comment');

const getDogComments = async (req, res) => {
    try {
        const comments = await (await Comment.find({ commented_on: req.params.id }, { _id: 0, text: 1, commenter: 1 })
        .populate({ path: 'commenter', select: [ 'firstName', 'lastName' ] }).exec()); //exec instead of populateExec when getting query???

        res.json(comments);
    } catch (err) {
        console.log('There has been an error fetching comments: ' + err);
        res.status(404).json({ message: 'Could not fetch comments' })
    }
}

const postDogComment = async (req, res) => {
    const newComment = new Comment({
        text: req.body.comment, 
        commenter: req.user.id,
        commented_on: req.params.id
    });

    try {
        const comment = await newComment.save();
        await comment.populate({ path: 'commenter', select: [ 'firstName', 'lastName' ] }).execPopulate();

        res.json(comment);
    } catch (err) {
        console.log('There has been error saving comment to database ' + err);
        res.json({ message: 'Could not post comment' })
    }
}

module.exports = {
    getDogComments,
    postDogComment
}