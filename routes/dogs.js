const express = require('express');
const multer = require('multer');

const { checkIfAuthenticated, checkIfNotAuthenticated } = require('../middleware/auth');
const { getDog, getDogsByUser, getNewDog, postNewDog, getUpdateDog, putUpdateDog, confirmDeleteDog, deleteDog } = require('../controllers/dogs');
const { isUserPosterOrAdmin } = require('../middleware/dogManagement');

const router = express.Router();

const upload = multer({
    dest: 'public/images/dogs',
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

router.get('/dog/:id', getDog);
router.get('/user/:id', checkIfAuthenticated, getDogsByUser);
router.get('/new', checkIfAuthenticated, getNewDog);
router.post('/new', checkIfAuthenticated, upload.single('image'), postNewDog);
router.get('/update/:id', checkIfAuthenticated, isUserPosterOrAdmin, getUpdateDog);
router.put('/update/:id', checkIfAuthenticated, isUserPosterOrAdmin, putUpdateDog);
router.get('/delete/:id', checkIfAuthenticated, isUserPosterOrAdmin, confirmDeleteDog);
router.delete('/delete/:id', checkIfAuthenticated, isUserPosterOrAdmin, deleteDog);

module.exports = router;