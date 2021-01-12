const express = require('express');

const { getDogs } = require('../controllers/index');

const router = express.Router();

router.get('/', getDogs);

module.exports = router;