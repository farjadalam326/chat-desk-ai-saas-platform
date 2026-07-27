import { Document } from '../models/Document.js';

export const getDocuments = async (req, res, next) => {
  try {
    const { search, sourceType, status } = req.query;
    const query = { workspaceId: req.workspaceId };

    if (sourceType) query.sourceType = sourceType;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const { title, content, sourceType } = req.body;
    const document = await Document.create({
      workspaceId: req.workspaceId,
      title,
      content,
      sourceType: sourceType || 'text',
      status: 'indexed',
      charCount: content.length,
    });

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const crawlUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    // Simple crawl simulation / fetch
    const title = `Web Scrape: ${new URL(url).hostname}`;
    const scrapedContent = `Website Content extracted from ${url}.\nProduct details, pricing, FAQs, support overview for ${new URL(url).hostname}.`;

    const document = await Document.create({
      workspaceId: req.workspaceId,
      title,
      content: scrapedContent,
      sourceType: 'url',
      status: 'indexed',
      charCount: scrapedContent.length,
    });

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await Document.findOneAndDelete({ _id: id, workspaceId: req.workspaceId });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const reindexKnowledge = async (req, res, next) => {
  try {
    await Document.updateMany(
      { workspaceId: req.workspaceId },
      { $set: { status: 'indexed' } }
    );
    return res.status(200).json({
      success: true,
      message: 'Knowledge Base re-indexed successfully',
    });
  } catch (error) {
    next(error);
  }
};
