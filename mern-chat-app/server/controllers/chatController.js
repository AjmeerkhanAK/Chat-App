
const Conversation = require("../models/Conversation");
const User = require("../models/User");

const getChats = async (req, res) => {
  try {
    const chats = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email avatar isOnline")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ chats });
  } catch (error) {
    console.error("Get chats error:", error.message);
    res.status(500).json({ message: "Unable to fetch chats." });
  }
};

const createChat = async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId || !recipientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Valid recipientId is required." });
    }

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot chat with yourself." });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, recipient._id], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipient._id],
        createdBy: req.user._id,
      });
    }

    await conversation.populate(
      "participants",
      "name email avatar isOnline"
    );

    res.status(201).json({ chat: conversation });
  } catch (error) {
    console.error("Create chat error:", error.message);
    res.status(500).json({ message: "Unable to create chat." });
  }
};

module.exports = { getChats, createChat };
