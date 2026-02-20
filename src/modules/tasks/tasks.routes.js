const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTags,
  createTag
} = require('./tasks.controller');

const authMiddleware = require('../../middleware/auth.middleware');

/* CREATE */
router.post(
  '/',
  authMiddleware,
  createTask
);

/* GET ALL */
router.get(
  '/',
  authMiddleware,
  getTasks
);

/* GET ONE */
router.get(
  '/:id',
  authMiddleware,
  getTaskById
);

/* UPDATE */
router.put(
  '/:id',
  authMiddleware,
  updateTask
);

/* DELETE */
router.delete(
  '/:id',
  authMiddleware,
  deleteTask
);

router.get('/tags', authMiddleware, getUserTags);
router.post('/tags', authMiddleware, createTag);

module.exports = router;
