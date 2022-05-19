const express = require('express');

const listingController = require('../controllers/listing');

const router = express.Router();

router.get('/', listingController.getAllListings);

router.get('/tenrandomlistings', listingController.getRandomTenListings);

router.get('/randomtenlistingsfromshop/:id', listingController.randomtenlistingsfromshop);

router.get('/fetchlisting/:id', listingController.fetchlisting);

router.get('/search/:search', listingController.search);

router.get('/searchbyshop/:storeid/:search', listingController.searchbystore);

router.get('/search/:search/:category', listingController.searchbycategory);

router.get('/searchbyshop/:storeid/:search/:category', listingController.searchbystorecategory);

router.get('/getcategoriesforshop/:storeid',listingController.getcategoriesforshop)

router.get('/getallcategories',listingController.getcategories)

router.get('/randomtenlistingsfromshopbycategory/:storeid/:category',listingController.getlistingsfromshopbycategory)

router.get('/randomtenlistingsbycategory/:category',listingController.getlistingsbycategory)

router.post('/', listingController.postListing);

router.put('/', listingController.putListing);

router.delete('/:id', listingController.deleteListing);

module.exports = router;
