const Ticket = require('../models/Ticket');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @GET /api/admin/tickets - Admin sees all tickets
const getAllTickets = async (req, res) => {
  try {
    const { status, category, priority, assignedTeam } = req.query;

    // Build filter object dynamically
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTeam) filter.assignedTeam = assignedTeam;

    const tickets = await Ticket.find(filter)
      .populate('customer', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/admin/tickets/:id - Admin sees single ticket
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('resolvedBy', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/admin/users - Admin sees all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @DELETE /api/admin/users/:id - Admin deletes a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @PUT /api/admin/tickets/:id - Admin manually updates ticket category/priority/team
const updateTicket = async (req, res) => {
  try {
    const { category, priority, assignedTeam, status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (assignedTeam) ticket.assignedTeam = assignedTeam;
    if (status) ticket.status = status;

    await ticket.save();

    res.status(200).json({
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/admin/stats - Admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const criticalTickets = await Ticket.countDocuments({ priority: 'Critical' });
    const totalUsers = await User.countDocuments({ role: 'customer' });

    const categoryBreakdown = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityBreakdown = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const teamBreakdown = await Ticket.aggregate([
      { $group: { _id: '$assignedTeam', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalTickets,
      openTickets,
      resolvedTickets,
      criticalTickets,
      totalUsers,
      categoryBreakdown,
      priorityBreakdown,
      teamBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @POST /api/admin/users - Admin creates team member
const createTeamMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow team roles
    const allowedRoles = ['finance_team', 'technical_team', 'product_team', 'general_team'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid team role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'Team member created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  getAllUsers,
  deleteUser,
  updateTicket,
  getDashboardStats,
  createTeamMember
};