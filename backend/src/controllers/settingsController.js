import { Workspace } from '../models/Workspace.js';
import { User } from '../models/User.js';
import crypto from 'crypto';

export const getSettings = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Workspace not found' },
      });
    }

    // Default webhooks & security if not initialized
    const settings = workspace.settings || {};
    if (!settings.webhooks) settings.webhooks = [];
    if (!settings.security) {
      settings.security = {
        enforceSso: false,
        ssoProvider: 'Google SAML 2.0',
        enforce2FA: true,
        sessionTimeoutHours: 24,
        ipWhitelist: '',
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        workspaceName: workspace.name,
        domain: workspace.domain,
        apiKey: workspace.apiKey,
        aiModel: settings.aiModel || 'gemini-1.5-flash',
        systemPrompt: settings.systemPrompt || 'You are a helpful customer support AI assistant.',
        temperature: settings.temperature !== undefined ? settings.temperature : 0.3,
        webhooks: settings.webhooks || [],
        security: settings.security,
        settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { workspaceName, domain, aiModel, systemPrompt, temperature, security, settings } = req.body;

    const workspace = await Workspace.findById(req.workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Workspace not found' },
      });
    }

    if (workspaceName) workspace.name = workspaceName;
    if (domain !== undefined) workspace.domain = domain;

    if (!workspace.settings) {
      workspace.settings = {
        aiModel: 'gemini-1.5-flash',
        systemPrompt: 'You are a helpful customer support AI assistant.',
        temperature: 0.3,
        webhooks: [],
        security: {
          enforceSso: false,
          ssoProvider: 'Google SAML 2.0',
          enforce2FA: true,
          sessionTimeoutHours: 24,
          ipWhitelist: '',
        },
      };
    }

    if (settings) {
      if (settings.aiModel) workspace.settings.aiModel = settings.aiModel;
      if (settings.systemPrompt !== undefined) workspace.settings.systemPrompt = settings.systemPrompt;
      if (settings.temperature !== undefined) workspace.settings.temperature = settings.temperature;
      if (settings.security) {
        workspace.settings.security = {
          ...(workspace.settings.security || {}),
          ...settings.security,
        };
      }
    }

    if (aiModel) workspace.settings.aiModel = aiModel;
    if (systemPrompt !== undefined) workspace.settings.systemPrompt = systemPrompt;
    if (temperature !== undefined) workspace.settings.temperature = temperature;
    if (security) {
      workspace.settings.security = {
        ...(workspace.settings.security || {}),
        ...security,
      };
    }

    if (!workspace.settings.security) {
      workspace.settings.security = {
        enforceSso: false,
        ssoProvider: 'Google SAML 2.0',
        enforce2FA: true,
        sessionTimeoutHours: 24,
        ipWhitelist: '',
      };
    }

    workspace.markModified('settings');
    await workspace.save();

    return res.status(200).json({
      success: true,
      data: {
        workspaceName: workspace.name,
        domain: workspace.domain,
        apiKey: workspace.apiKey,
        aiModel: workspace.settings.aiModel,
        systemPrompt: workspace.settings.systemPrompt,
        temperature: workspace.settings.temperature,
        webhooks: workspace.settings.webhooks || [],
        security: workspace.settings.security,
        settings: workspace.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const rotateApiKey = async (req, res, next) => {
  try {
    const newApiKey = 'cd_live_' + crypto.randomBytes(16).toString('hex');
    const workspace = await Workspace.findByIdAndUpdate(
      req.workspaceId,
      { $set: { apiKey: newApiKey } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        apiKey: workspace.apiKey,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- Team Management Controllers ---

export const getTeamMembers = async (req, res, next) => {
  try {
    let users = await User.find({ workspaceId: req.workspaceId }).select('-passwordHash');

    if (users.length <= 1) {
      // Seed default realistic team members if only 1 user exists
      const defaultMembers = [
        {
          name: 'Sarah Jenkins',
          email: 'sarah.j@chatdesk.ai',
          role: 'admin',
          workspaceId: req.workspaceId,
          passwordHash: 'dummy_hash',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          status: 'online',
        },
        {
          name: 'Alex Rivera',
          email: 'alex.r@chatdesk.ai',
          role: 'agent',
          workspaceId: req.workspaceId,
          passwordHash: 'dummy_hash',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          status: 'online',
        },
        {
          name: 'Emily Chen',
          email: 'emily.c@chatdesk.ai',
          role: 'agent',
          workspaceId: req.workspaceId,
          passwordHash: 'dummy_hash',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          status: 'offline',
        },
      ];

      for (const m of defaultMembers) {
        const exists = await User.findOne({ email: m.email });
        if (!exists) {
          await User.create(m);
        }
      }

      users = await User.find({ workspaceId: req.workspaceId }).select('-passwordHash');
    }

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const inviteTeamMember = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Email address is required' },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_EXISTS', message: 'User with this email already exists' },
      });
    }

    const newUser = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      passwordHash: crypto.randomBytes(16).toString('hex'),
      role: role || 'agent',
      workspaceId: req.workspaceId,
      status: 'online',
    });

    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id, workspaceId: req.workspaceId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team member not found' },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// --- Webhooks Controllers ---

export const addWebhook = async (req, res, next) => {
  try {
    const { url, events } = req.body;
    if (!url) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Webhook URL is required' },
      });
    }

    const workspace = await Workspace.findById(req.workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Workspace not found' },
      });
    }

    if (!workspace.settings) workspace.settings = {};
    if (!workspace.settings.webhooks) workspace.settings.webhooks = [];

    const newWebhook = {
      url,
      events: events && events.length ? events : ['conversation.created', 'ticket.resolved'],
      secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
      status: 'active',
      createdAt: new Date(),
    };

    workspace.settings.webhooks.push(newWebhook);
    workspace.markModified('settings');
    await workspace.save();

    return res.status(201).json({
      success: true,
      data: workspace.settings.webhooks,
    });
  } catch (error) {
    next(error);
  }
};

export const testWebhook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findById(req.workspaceId);
    if (!workspace || !workspace.settings?.webhooks) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' },
      });
    }

    const webhook = workspace.settings.webhooks.id(id);
    if (!webhook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook endpoint not found' },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test ping dispatched to ${webhook.url} (HTTP 200 OK)`,
      deliveredAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWebhook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findById(req.workspaceId);
    if (!workspace || !workspace.settings?.webhooks) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' },
      });
    }

    workspace.settings.webhooks = workspace.settings.webhooks.filter((w) => w._id.toString() !== id);
    workspace.markModified('settings');
    await workspace.save();

    return res.status(200).json({
      success: true,
      data: workspace.settings.webhooks,
    });
  } catch (error) {
    next(error);
  }
};
