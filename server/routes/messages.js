const router = require('express').Router();
const Message = require('../models/Message');

/**
 * Create a new message in a conversation.
 */
router.post('/', async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    if (!conversationId || !sender || !text) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });
    const saved = await newMessage.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get all messages from a conversation.
 */
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;