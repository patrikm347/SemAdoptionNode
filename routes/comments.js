const express = require('express');
const { checkIfAuthenticated } = require('../middleware/auth');
const { getDogComments, postDogComment } = require('../controllers/comments');

const router = express.Router();

router.get('/dog/:id', getDogComments);
router.post('/dog/:id', checkIfAuthenticated, postDogComment);

module.exports = router;