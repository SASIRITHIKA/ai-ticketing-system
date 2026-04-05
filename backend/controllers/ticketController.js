const Ticket = require('../models/Ticket');
const axios = require('axios');

// Map category to team
const categoryToTeam = {
  'Billing Issue': 'finance_team',
  'Technical Problem': 'technical_team',
  'Feature Request': 'product_team',
  'Account Management': 'general_team',
  'General Query': 'general_team'
};

// @POST /api/tickets - Customer submits a ticket
const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Call Python AI model
    let category = 'General Query';
    let priority = 'Low';
    let aiSummary = '';

    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, {
        text: `${title} ${description}`
      });
      category = aiResponse.data.category;
      priority = aiResponse.data.priority;
      aiSummary = aiResponse.data.summary;
    } catch (aiError) {
      console.log('AI service unavailable, using defaults');
    }

    const assignedTeam = categoryToTeam[category] || 'general_team';

    const ticket = await Ticket.create({
      title,
      description,
      aiSummary,
      category,
      priority,
      assignedTeam,
      customer: req.user.id
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/tickets/my - Customer sees their own tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/tickets/team - Team sees their assigned tickets
const getTeamTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTeam: req.user.role })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/tickets/:id - Get single ticket
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('resolvedBy', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Customer can only see their own ticket
    if (req.user.role === 'customer' && 
        ticket.customer._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Team can only see their assigned tickets
    const teamRoles = ['finance_team', 'technical_team', 'product_team', 'general_team'];
    if (teamRoles.includes(req.user.role) && ticket.assignedTeam !== req.user.role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT /api/tickets/:id/resolve - Team resolves a ticket
const resolveTicket = async (req, res) => {
  try {
    const { remarks, status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only assigned team can resolve
    if (ticket.assignedTeam !== req.user.role) {
      return res.status(403).json({ message: 'Access denied. Not your assigned ticket.' });
    }

    ticket.status = status || 'Resolved';
    ticket.remarks = remarks || '';
    ticket.resolvedBy = req.user.id;
    ticket.resolvedAt = new Date();

    await ticket.save();

    res.status(200).json({
      message: 'Ticket updated successfully',
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    if (ticket.customer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied. Not your ticket.' })
    }

    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      return res.status(400).json({ message: 'Cannot delete a resolved or closed ticket' })
    }

    await Ticket.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Ticket deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  createTicket,
  getMyTickets,
  getTeamTickets,
  getTicketById,
  resolveTicket,
  deleteTicket
}