const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTeamTickets,
  getTicketById,
  resolveTicket,
  deleteTicket
} = require('../controllers/ticketController')
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const teamRoles = ['finance_team', 'technical_team', 'product_team', 'general_team'];

// Customer routes
router.post('/', protect, allowRoles('customer'), createTicket);
router.get('/my', protect, allowRoles('customer'), getMyTickets);
router.delete('/:id', protect, allowRoles('customer'), deleteTicket)

// Team routes
router.get('/team', protect, allowRoles(...teamRoles), getTeamTickets);
router.put('/:id/resolve', protect, allowRoles(...teamRoles), resolveTicket);

// Shared route - must be last
router.get('/:id', protect, getTicketById);

module.exports = router;