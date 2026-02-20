const express = require('express');
const router = express.Router();

const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry
} = require('./diary.controller');

const authMiddleware =
  require('../../middleware/auth.middleware');


/* CREATE */
router.post(
  '/',
  authMiddleware,
  createEntry
);

/* GET ALL */
router.get(
  '/',
  authMiddleware,
  getEntries
);

/* GET ONE */
router.get(
  '/:id',
  authMiddleware,
  getEntryById
);

/* UPDATE */
router.put(
  '/:id',
  authMiddleware,
  updateEntry
);

/* DELETE */
router.delete(
  '/:id',
  authMiddleware,
  deleteEntry
);

module.exports = router;
