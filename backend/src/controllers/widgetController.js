import { WidgetConfig } from '../models/WidgetConfig.js';
import { Workspace } from '../models/Workspace.js';

export const getWidgetConfig = async (req, res, next) => {
  try {
    let config = await WidgetConfig.findOne({ workspaceId: req.workspaceId });
    if (!config) {
      config = await WidgetConfig.create({ workspaceId: req.workspaceId });
    }
    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWidgetConfig = async (req, res, next) => {
  try {
    const config = await WidgetConfig.findOneAndUpdate(
      { workspaceId: req.workspaceId },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicWidgetConfig = async (req, res, next) => {
  try {
    const { apiKey } = req.params;
    const workspace = await Workspace.findOne({ apiKey });
    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: { code: 'INVALID_API_KEY', message: 'Workspace with provided API key not found.' },
      });
    }

    const config = await WidgetConfig.findOne({ workspaceId: workspace._id });
    return res.status(200).json({
      success: true,
      data: {
        workspaceId: workspace._id,
        workspaceName: workspace.name,
        botName: config?.botName || 'AI Assistant',
        welcomeMessage: config?.welcomeMessage || 'Hello! How can I help you today?',
        primaryColor: config?.primaryColor || '#6366f1',
        themeMode: config?.themeMode || 'dark',
        position: config?.position || 'bottom-right',
        avatarUrl: config?.avatarUrl || '',
        customCss: config?.customCss || '',
      },
    });
  } catch (error) {
    next(error);
  }
};
