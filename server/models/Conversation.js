const mongoose = require('mongoose');

/**
 * Conversation schema.
 * Each conversation stores an array of participant user IDs.
 * Using an array allows for group chats if extended in the future.
 */
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);