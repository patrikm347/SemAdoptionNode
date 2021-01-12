function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('errors', 'You are not authorized to do that');
    return res.redirect('/');
}

function checkIfNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

function isAdmin(req, res, next) {
    if (req.user.role === 'Admin') {
        return next();
    }

    req.flash('errors', 'You are not an admin');
    return res.redirect('/');   
}

module.exports = {  
    checkIfAuthenticated,
    checkIfNotAuthenticated,
    isAdmin
}