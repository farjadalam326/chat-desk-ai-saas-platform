import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
      default: '',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'pro',
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    settings: {
      aiModel: {
        type: String,
        default: 'gemini-1.5-flash',
      },
      systemPrompt: {
        type: String,
        default: 'You are a helpful customer support AI assistant. Answer accurately based on knowledge base.',
      },
      temperature: {
        type: Number,
        default: 0.7,
        min: 0,
        max: 1,
      },
      fallbackToHuman: {
        type: Boolean,
        default: true,
      },
      webhooks: [
        {
          url: { type: String, required: true },
          events: [{ type: String }],
          secret: { type: String, required: true },
          status: { type: String, default: 'active' },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      security: {
        type: {
          enforceSso: { type: Boolean, default: false },
          ssoProvider: { type: String, default: 'Google SAML 2.0' },
          enforce2FA: { type: Boolean, default: true },
          sessionTimeoutHours: { type: Number, default: 24 },
          ipWhitelist: { type: String, default: '' },
        },
        default: () => ({
          enforceSso: false,
          ssoProvider: 'Google SAML 2.0',
          enforce2FA: true,
          sessionTimeoutHours: 24,
          ipWhitelist: '',
        }),
      },
    },
  },
  { timestamps: true }
);

export const Workspace = mongoose.model('Workspace', workspaceSchema);
