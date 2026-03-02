const express = require('express');
const router  = express.Router();
const ctrl    = require('./travel.controller');
const auth    = require('../../middleware/auth.middleware');

// ── Trip expense sub-routes (MUST be before /:id) ──
router.post(  '/:id/expenses',          auth, ctrl.addTripExpense);
router.delete('/:id/expenses/:expId',   auth, ctrl.deleteTripExpense);

// ── Trips ──
router.get(   '/',     auth, ctrl.getTrips);
router.get(   '/:id',  auth, ctrl.getTrip);
router.post(  '/',     auth, ctrl.createTrip);
router.put(   '/:id',  auth, ctrl.updateTrip);
router.delete('/:id',  auth, ctrl.deleteTrip);

module.exports = router;
