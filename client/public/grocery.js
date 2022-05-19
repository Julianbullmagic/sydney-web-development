const express = require('express');

const groceryController = require('../controllers/grocery');
const storeController = require('../controllers/store');

const router = express.Router();

router.get('/', groceryController.getAllGroceries);
router.get('/getstores', storeController.getAllStores);

router.post('/', groceryController.postGrocery);

router.post('/addplace', groceryController.addPlace);

router.put('/', groceryController.putGrocery);

router.delete('/:id', groceryController.deleteGrocery);

module.exports = router;
