import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    totalConversations: {
      type: Number,
      default: 0,
    },
    aiResolved: {
      type: Number,
      default: 0,
    },
    agentResolved: {
      type: Number,
      default: 0,
    },
    avgResponseTimeSeconds: {
      type: Number,
      default: 0,
    },
    csatScore: {
      type: Number,
      default: 5.0,
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ workspaceId: 1, date: 1 }, { unique: true });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
