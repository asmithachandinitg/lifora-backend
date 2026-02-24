const express = require('express');
const router = express.Router();
const ctrl = require('./travel.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/',      auth, ctrl.getTrips);
router.get('/:id',   auth, ctrl.getTrip);
router.post('/',     auth, ctrl.createTrip);
router.put('/:id',   auth, ctrl.updateTrip);
router.delete('/:id', auth, ctrl.deleteTrip);

module.exports = router;
