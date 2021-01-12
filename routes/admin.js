const express = require('express');

const { getAdminData, deleteUser } = require('../controllers/admin');
const { checkIfAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', checkIfAuthenticated, isAdmin, getAdminData);
router.delete('/deleteuser/:id', checkIfAuthenticated, isAdmin, deleteUser);

module.exports = router;