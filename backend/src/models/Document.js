import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ['text', 'file', 'url'],
      default: 'text',
    },
    content: {
      type: String,
      required: [true, 'Document content is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'indexed', 'failed'],
      default: 'indexed',
    },
    charCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
