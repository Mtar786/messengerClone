const router = require('express').Router();
const Conversation = require('../models/Conversation');

/**
 * Create a new conversation if one doesn't exist between two users.
 * Accepts senderId and receiverId in the body.
 */
router.post('/', async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    return res.status(400).json({ message: 'Missing senderId or receiverId' });
  }
  try {
    // Check if a conversation already exists between these users
    const existing = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (existing) return res.status(200).json(existing);

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    const saved = await newConversation.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get all conversations for a given user.
 * Uses $in to find any conversation containing the user's id【444182637821624†L157-L160】.
 */
router.get('/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;