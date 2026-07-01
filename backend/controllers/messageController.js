import Message from '../models/Message.js';

// @desc    Create a new contact message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject: subject || '',
      message
    });

    res.status(201).json({
      message: 'Message sent successfully!',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

// @desc    Get all messages (for admin dashboard, optional future use)
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).json({ message: 'Server error loading messages' });
  }
};
