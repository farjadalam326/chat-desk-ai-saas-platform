import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { Workspace } from "../models/Workspace.js";
import { generateAIResponse } from "../services/aiService.js";

const seedDefaultConversations = async (workspaceId) => {
  try {
    const seedData = [
      {
        visitorId: "visitor_elena_001",
        visitorInfo: {
          name: "Elena Rostova",
          email: "elena@fintech.io",
          browser: "Chrome 126.0 (macOS)",
          location: "London, UK",
        },
        status: "resolved",
        messages: [
          {
            senderType: "visitor",
            senderId: "visitor_elena_001",
            text: "Hi! How do I setup double webhook authentication signatures in ChatDesk?",
          },
          {
            senderType: "bot",
            senderId: "ai-bot",
            text: 'To verify HMAC signatures on incoming webhooks, check the x-chatdesk-signature header using your API secret key: crypto.createHmac("sha256", secret).update(body).digest("hex"). Source: Developer Docs Section 4.2.',
          },
          {
            senderType: "visitor",
            senderId: "visitor_elena_001",
            text: "That works great! Thanks so much.",
          },
        ],
      },
      {
        visitorId: "visitor_marcus_002",
        visitorInfo: {
          name: "Marcus Vance",
          email: "marcus@enterprise.com",
          browser: "Safari 17.4 (iOS)",
          location: "New York, USA",
        },
        status: "pending",
        messages: [
          {
            senderType: "visitor",
            senderId: "visitor_marcus_002",
            text: "Can I upgrade my plan to Enterprise tier for custom SLA and SOC-2 compliance?",
          },
          {
            senderType: "bot",
            senderId: "ai-bot",
            text: "Yes! The Enterprise tier includes custom SLA guarantees, SOC-2 compliance audits, and dedicated 24/7 account management.",
          },
          {
            senderType: "visitor",
            senderId: "visitor_marcus_002",
            text: "Great, I would like to talk to an account manager.",
          },
        ],
      },
      {
        visitorId: "visitor_sarah_003",
        visitorInfo: {
          name: "Sarah Jenkins",
          email: "sarah@designhub.co",
          browser: "Firefox 125.0 (Windows)",
          location: "Toronto, Canada",
        },
        status: "open",
        messages: [
          {
            senderType: "visitor",
            senderId: "visitor_sarah_003",
            text: "Does ChatDesk AI widget support custom CSS and dark mode themes?",
          },
          {
            senderType: "bot",
            senderId: "ai-bot",
            text: "Absolutely! You can customize branding, primary accent colors, widget position, and dark/light modes directly in the Widget Studio.",
          },
        ],
      },
    ];

    for (const item of seedData) {
      const conv = await Conversation.create({
        workspaceId,
        visitorId: item.visitorId,
        visitorInfo: item.visitorInfo,
        status: item.status,
        lastMessageAt: new Date(),
      });

      for (const msg of item.messages) {
        await Message.create({
          workspaceId,
          conversationId: conv._id,
          senderType: msg.senderType,
          senderId: msg.senderId,
          text: msg.text,
        });
      }
    }
  } catch (err) {
    console.error("Failed to seed default conversations:", err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const { status, agentId, search, page = 1, limit = 20 } = req.query;
    const query = { workspaceId: req.workspaceId };

    if (status) query.status = status;
    if (agentId) query.assignedAgentId = agentId;
    if (search) {
      query.$or = [
        { "visitorInfo.name": { $regex: search, $options: "i" } },
        { "visitorInfo.email": { $regex: search, $options: "i" } },
        { visitorId: { $regex: search, $options: "i" } },
      ];
    }

    let total = await Conversation.countDocuments(query);

    // Auto-seed sample conversation threads if database has no conversations yet
    if (total === 0 && !status && !agentId && !search) {
      await seedDefaultConversations(req.workspaceId);
      total = await Conversation.countDocuments(query);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const conversations = await Conversation.find(query)
      .populate("assignedAgentId", "name email avatar")
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOne({
      _id: id,
      workspaceId: req.workspaceId,
    }).populate("assignedAgentId", "name email avatar");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Conversation not found" },
      });
    }

    const messages = await Message.find({
      conversationId: id,
      workspaceId: req.workspaceId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: {
        conversation,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, workspaceId: req.workspaceId },
      { $set: { status } },
      { new: true },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Conversation not found" },
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const assignAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, workspaceId: req.workspaceId },
      { $set: { assignedAgentId: agentId } },
      { new: true },
    ).populate("assignedAgentId", "name email avatar");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Conversation not found" },
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const conversation = await Conversation.findOne({
      _id: id,
      workspaceId: req.workspaceId,
    });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Conversation not found" },
      });
    }

    conversation.internalNotes.push({
      note,
      agentName: req.user.name || "Agent",
      createdAt: new Date(),
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// Public Widget Endpoint: Visitor starts conversation or sends message
export const startPublicChat = async (req, res, next) => {
  try {
    const { apiKey, visitorId, visitorInfo, message } = req.body;

    const workspace = await Workspace.findOne({ apiKey });
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: { code: "INVALID_API_KEY", message: "Workspace not found" },
      });
    }

    // Find existing open conversation or create new one
    let conversation = await Conversation.findOne({
      workspaceId: workspace._id,
      visitorId,
      status: { $in: ["open", "pending"] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        workspaceId: workspace._id,
        visitorId,
        visitorInfo: visitorInfo || {},
        status: "open",
      });
    }

    // Save visitor message
    const userMsg = await Message.create({
      workspaceId: workspace._id,
      conversationId: conversation._id,
      senderType: "visitor",
      senderId: visitorId,
      text: message,
    });

    // Get recent chat history for context
    const history = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    // Trigger AI Service Response if no human agent is assigned
    let botMsg = null;
    if (!conversation.assignedAgentId) {
      const aiResult = await generateAIResponse({
        workspaceId: workspace._id,
        userMessage: message,
        conversationHistory: history,
      });

      botMsg = await Message.create({
        workspaceId: workspace._id,
        conversationId: conversation._id,
        senderType: "bot",
        senderId: "ai-bot",
        text: aiResult.text,
      });

      if (aiResult.needsHumanHandover) {
        conversation.status = "pending"; // Requires agent review
      }
    }

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        userMessage: userMsg,
        botMessage: botMsg,
        status: conversation.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, senderType = "agent" } = req.body;

    const conversation = await Conversation.findOne({
      _id: id,
      workspaceId: req.workspaceId,
    });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Conversation not found" },
      });
    }

    const message = await Message.create({
      workspaceId: req.workspaceId,
      conversationId: conversation._id,
      senderType,
      senderId: req.user?._id || req.user?.id || "agent",
      text,
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
