const express = require('express');
const router = express.Router();
const locationController = require('../controllers/cityController');

// Create and fetch
router.post('/locations', locationController.createLocation);
router.get('/locations', locationController.getAllLocations);

// Delete
router.delete('/locations/country/:country', locationController.deleteCountry);
router.delete('/locations/state/:state', locationController.deleteState);
router.delete('/locations/city/:city', locationController.deleteCity);

// Edit
router.put('/locations/edit-country', locationController.editCountry);
router.put('/locations/edit-state', locationController.editState);
router.put('/locations/edit-city', locationController.editCity);

module.exports = router;

