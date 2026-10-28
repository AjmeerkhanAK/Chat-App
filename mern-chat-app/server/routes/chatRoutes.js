
const express = require("express");
const { getChats, createChat } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getChats);
router.post("/", createChat);

module.exports = router;
