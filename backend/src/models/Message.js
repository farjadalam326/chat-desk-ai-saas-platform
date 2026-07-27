import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ['visitor', 'bot', 'agent'],
      required: true,
    },
    senderId: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
    },
    attachments: [
      {
        url: { type: String },
        type: { type: String },
        name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
