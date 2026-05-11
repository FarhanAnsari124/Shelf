const express = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  respondToOffer,
  findConversation,
} = require("./conversation.controller");
const { protect } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/", getConversations);
router.get("/find", findConversation);
router.get("/:conversationId/messages", getMessages);
router.post("/", sendMessage);
router.patch("/:conversationId/read", markAsRead);
router.patch("/offers/:messageId", respondToOffer);

module.exports = router;
