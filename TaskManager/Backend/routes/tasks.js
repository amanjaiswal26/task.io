const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/tasks');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes are protected
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/status')
  .put(updateTaskStatus);

module.exports = router;


