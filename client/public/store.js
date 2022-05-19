const express = require('express');

const storeController = require('../controllers/store');

const router = express.Router();

router.get('/', storeController.getAllStores);

router.get('/search/:search', storeController.search);

router.get('/search/:search/:category', storeController.searchbycategory);

router.get('/getrandomten', storeController.getRandomTenStores);

router.get('/fetchstore/:id', storeController.fetchStore);

module.exports = router;
