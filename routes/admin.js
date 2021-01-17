const express = require('express');

const { getAdminData, deleteUser, postBreed } = require('../controllers/admin');
const { checkIfAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', checkIfAuthenticated, isAdmin, getAdminData);
router.delete('/deleteuser/:id', checkIfAuthenticated, isAdmin, deleteUser);
router.post('/breeds/new', checkIfAuthenticated, isAdmin, postBreed);
//router.delete('/breeds/delete', checkIfAuthenticated, isAdmin, deleteBreed);

module.exports = router;