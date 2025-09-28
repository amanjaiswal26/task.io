const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/admin');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAnalytics,
  getAllTasks
} = require('../controllers/admin');

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminAuth);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Analytics routes
router.get('/analytics', getAnalytics);

// Task management routes
router.get('/tasks', getAllTasks);

module.exports = router;
