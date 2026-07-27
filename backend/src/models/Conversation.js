import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    visitorInfo: {
      name: { type: String, default: 'Anonymous Visitor' },
      email: { type: String, default: '' },
      ip: { type: String, default: '' },
      browser: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        agentName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
