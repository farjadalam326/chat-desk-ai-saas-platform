import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';
import { WidgetConfig } from '../models/WidgetConfig.js';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '719064177864-19ct5oi8eoh5riombodk6k7nhqpihngq.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Generate JWT token containing userId & workspaceId for multi-tenant isolation
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_chatdesk_ai_saas_2026_987654321';
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, workspaceName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' },
      });
    }

    // 1. Create Workspace
    const apiKey = 'cd_' + crypto.randomBytes(16).toString('hex');
    const workspace = await Workspace.create({
      name: workspaceName,
      apiKey,
    });

    // 2. Create User linked to Workspace via workspaceId (foreign key)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'owner',
      workspaceId: workspace._id,
    });

    // 3. Initialize default Widget Config
    await WidgetConfig.create({
      workspaceId: workspace._id,
      botName: `${workspaceName} Assistant`,
    });

    // 4. Issue JWT
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
        },
        workspace: {
          id: workspace._id,
          name: workspace.name,
          apiKey: workspace.apiKey,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const workspace = await Workspace.findById(user.workspaceId);

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
          avatar: user.avatar,
        },
        workspace: {
          id: workspace?._id,
          name: workspace?.name || 'Workspace',
          apiKey: workspace?.apiKey,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    const workspace = await Workspace.findById(user.workspaceId);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
          avatar: user.avatar,
        },
        workspace,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAgents = async (req, res, next) => {
  try {
    // Tenant isolation: find users matching workspaceId
    const agents = await User.find({ workspaceId: req.workspaceId }).select('-passwordHash');
    return res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
};

export const inviteAgent = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email already exists.' },
      });
    }

    // Default temporary password
    const tempPassword = 'TempPassword123!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const newAgent = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'agent',
      workspaceId: req.workspaceId,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        role: newAgent.role,
        workspaceId: newAgent.workspaceId,
        temporaryPassword: tempPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await User.findOneAndDelete({ _id: id, workspaceId: req.workspaceId });
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Agent not found in workspace' },
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Agent removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.clearCookie('chatdesk_auth_token');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential, code } = req.body;

    if (!credential && !code) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CREDENTIAL', message: 'Google auth token or code is required' },
      });
    }

    let payload = null;

    if (credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else if (code) {
      const oauth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'postmessage'
      );
      const { tokens } = await oauth2Client.getToken(code);
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_GOOGLE_TOKEN', message: 'Failed to verify Google account' },
      });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });
    let workspace = null;

    if (user) {
      if (picture && !user.avatar) {
        user.avatar = picture;
        await user.save();
      }
      workspace = await Workspace.findById(user.workspaceId);
    } else {
      const workspaceName = `${name.split(' ')[0]}'s Support Workspace`;
      const apiKey = 'cd_' + crypto.randomBytes(16).toString('hex');
      workspace = await Workspace.create({
        name: workspaceName,
        apiKey,
      });

      const randomPassword = crypto.randomBytes(32).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'owner',
        workspaceId: workspace._id,
        avatar: picture || '',
      });

      await WidgetConfig.create({
        workspaceId: workspace._id,
        botName: `${workspaceName} Assistant`,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          workspaceId: user.workspaceId,
        },
        workspace: {
          id: workspace?._id || user.workspaceId,
          name: workspace?.name || 'My Workspace',
          apiKey: workspace?.apiKey || '',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
