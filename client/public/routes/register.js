const express = require('express');

const storeController = require('../controllers/register');

const router = express.Router();

router.post('/', storeController.register);

module.exports = router;
