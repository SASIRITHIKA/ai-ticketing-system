const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  getAllUsers,
  deleteUser,
  updateTicket,
  getDashboardStats,
  createTeamMember
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// All admin routes protected
router.use(protect);
router.use(allowRoles('admin'));

router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketById);
router.put('/tickets/:id', updateTicket);

router.post('/users', createTeamMember);
router.delete('/users/:id', deleteUser);
router.get('/stats', getDashboardStats);

module.exports = router;