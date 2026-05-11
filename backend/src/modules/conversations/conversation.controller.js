const Conversation = require("./conversation.model");
const Message = require("./message.model");
const Listing = require("../listings/listing.model");

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
      isArchived: false,
    })
      .populate("participants", "name avatarUrl")
      .populate("listingId", "title price images")
      .sort("-lastMessageAt");

    const data = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        senderId: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      });
      return { ...conv.toObject(), unreadCount };
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({ _id: conversationId, participants: req.user.id });

    if (!conversation) return res.status(404).json({ success: false, message: "Not found" });

    const messages = await Message.find({ conversationId }).sort("createdAt");
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { listingId, receiverId, type, content, offer } = req.body;

    let conversation = await Conversation.findOne({
      listingId,
      participants: { $all: [req.user.id, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({ listingId, participants: [req.user.id, receiverId] });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      type,
      content,
      offer,
      readBy: [req.user.id]
    });

    conversation.lastMessage = type === "offer" ? `Offer: ₹${offer.amount}` : content;
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    const io = req.app.get("io");
    if (io) {
      conversation.participants.forEach(p => {
        io.to(p.toString()).emit("new_message", {
          conversationId: conversation._id,
          listingId: conversation.listingId,
          senderId: req.user.id,
          message
        });
        io.to(p.toString()).emit("unread_update");
      });
    }

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Message.updateMany(
      { conversationId, readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    const io = req.app.get("io");
    if (io) io.to(req.user.id).emit("unread_update");

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.respondToOffer = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const message = await Message.findById(messageId).populate("conversationId");
    if (!message || message.type !== "offer") return res.status(404).json({ success: false });

    const pIds = message.conversationId.participants.map(p => p.toString());
    if (!pIds.includes(req.user.id.toString())) return res.status(403).json({ success: false });

    message.offer.status = status;
    await message.save();

    const io = req.app.get("io");
    if (io) pIds.forEach(p => io.to(p).emit("offer_updated", { messageId, status }));

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.findConversation = async (req, res) => {
  try {
    const { listingId, receiverId } = req.query;
    const conversation = await Conversation.findOne({
      listingId,
      participants: { $all: [req.user.id, receiverId] }
    });
    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
