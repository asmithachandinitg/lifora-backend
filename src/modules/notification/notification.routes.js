const express = require('express');
const router  = express.Router();
const auth    = require('../../middleware/auth.middleware');
const ctrl    = require('./notification.controller');

router.get('/',                  auth, ctrl.getState);
router.put('/read/:id',          auth, ctrl.markRead);
router.put('/read-all',          auth, ctrl.markAllRead);
router.put('/dismiss/:id',       auth, ctrl.dismiss);
router.delete('/dismiss-all',    auth, ctrl.dismissAll);

module.exports = router;
