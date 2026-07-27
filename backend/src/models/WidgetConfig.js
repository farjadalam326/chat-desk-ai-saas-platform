import mongoose from 'mongoose';

const widgetConfigSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      unique: true,
      index: true,
    },
    botName: {
      type: String,
      default: 'ChatDesk AI Assistant',
    },
    welcomeMessage: {
      type: String,
      default: 'Hi there! 👋 How can we help you today?',
    },
    primaryColor: {
      type: String,
      default: '#6366f1',
    },
    themeMode: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left'],
      default: 'bottom-right',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    customCss: {
      type: String,
      default: '',
    },
    allowedDomains: {
      type: [String],
      default: ['*'],
    },
  },
  { timestamps: true }
);

export const WidgetConfig = mongoose.model('WidgetConfig', widgetConfigSchema);
