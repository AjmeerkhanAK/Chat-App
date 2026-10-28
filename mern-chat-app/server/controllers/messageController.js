
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID." });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Unable to fetch messages." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID." });
    }

    if (typeof text !== "string" || !text.trim() || text.trim().length > 5000) {
      return res.status(400).json({
        message: "Message must contain 1 to 5000 characters.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
      readBy: [req.user._id],
    });

    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    await message.populate("sender", "name email avatar");

    res.status(201).json({ message });
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Unable to send message." });
  }
};

module.exports = { getMessages, sendMessage };
