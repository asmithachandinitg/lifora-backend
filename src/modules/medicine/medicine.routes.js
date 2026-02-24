const express = require('express');
const router = express.Router();
const ctrl = require('./medicine.controller');
const auth = require('../../middleware/auth.middleware');

// Medicine routes
router.get('/',     auth, ctrl.getMedicines);
router.post('/',    auth, ctrl.createMedicine);
router.put('/:id',  auth, ctrl.updateMedicine);
router.delete('/:id', auth, ctrl.deleteMedicine);

// Dose log routes — must be before /:id
router.get('/logs',       auth, ctrl.getDoseLogs);
router.post('/logs',      auth, ctrl.createDoseLog);
router.delete('/logs/:id', auth, ctrl.deleteDoseLog);

module.exports = router;
