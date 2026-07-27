import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { generateAIResponse } from '../services/aiService.js';

export const setupChatSockets = (io) => {
  const chatNs = io.of('/ws/chat');

  chatNs.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Visitor or Agent joins a specific conversation room
    socket.on('join_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.join(`conv_${conversationId}`);
        console.log(`[Socket.io] Socket ${socket.id} joined conv_${conversationId}`);
      }
    });

    // Agent joins workspace room for live dashboard notifications
    socket.on('join_workspace', ({ workspaceId }) => {
      if (workspaceId) {
        socket.join(`ws_${workspaceId}`);
        console.log(`[Socket.io] Socket ${socket.id} joined ws_${workspaceId}`);
      }
    });

    // Real-time live messaging
    socket.on('send_message', async ({ conversationId, workspaceId, senderType, senderId, text }) => {
      try {
        if (!conversationId || !text) return;

        // 1. Create and save message in DB
        const message = await Message.create({
          workspaceId,
          conversationId,
          senderType, // 'visitor', 'agent', 'bot'
          senderId,
          text,
        });

        // 2. Broadcast message to all users in conversation room
        chatNs.to(`conv_${conversationId}`).emit('new_message', message);

        // 3. Update Conversation last message timestamp
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.lastMessageAt = new Date();
          await conversation.save();

          // Notify dashboard of updated conversation
          chatNs.to(`ws_${workspaceId}`).emit('conversation_updated', conversation);

          // 4. Auto AI Bot response if message is from visitor & no human agent assigned
          if (senderType === 'visitor' && !conversation.assignedAgentId) {
            // Fetch recent history
            const history = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(10);
            
            // Generate Gemini AI response
            const aiResult = await generateAIResponse({
              workspaceId,
              userMessage: text,
              conversationHistory: history,
            });

            const botMessage = await Message.create({
              workspaceId,
              conversationId,
              senderType: 'bot',
              senderId: 'ai-bot',
              text: aiResult.text,
            });

            // Emit AI answer to room
            chatNs.to(`conv_${conversationId}`).emit('new_message', botMessage);

            if (aiResult.needsHumanHandover) {
              conversation.status = 'pending';
              await conversation.save();
              chatNs.to(`conv_${conversationId}`).emit('agent_handover', {
                conversationId,
                status: 'pending_agent',
              });
            }
          }
        }
      } catch (error) {
        console.error(`[Socket Error] send_message failed: ${error.message}`);
        socket.emit('socket_error', { message: 'Failed to send message' });
      }
    });

    // Typing Indicators
    socket.on('typing_start', ({ conversationId, userType }) => {
      socket.to(`conv_${conversationId}`).emit('user_typing_status', {
        conversationId,
        userType,
        isTyping: true,
      });
    });

    socket.on('typing_stop', ({ conversationId, userType }) => {
      socket.to(`conv_${conversationId}`).emit('user_typing_status', {
        conversationId,
        userType,
        isTyping: false,
      });
    });

    // Agent Handover Event
    socket.on('request_human_handover', async ({ conversationId, workspaceId }) => {
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $set: { status: 'pending' } },
        { new: true }
      );
      chatNs.to(`conv_${conversationId}`).emit('agent_handover', {
        conversationId,
        status: 'pending',
      });
      chatNs.to(`ws_${workspaceId}`).emit('conversation_updated', conversation);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
