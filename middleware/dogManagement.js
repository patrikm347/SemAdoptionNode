const user = require("../models/user");

const isUserPosterOrAdmin = (req, res, next) => {
    const dogId = req.params.id;
    if (req.user.id === dogId || req.user.role === 'Admin') {
        return next();
    }

    req.flash('errors', 'You are not poster of this dog');
    res.redirect('/');
}

module.exports = {
    isUserPosterOrAdmin
}