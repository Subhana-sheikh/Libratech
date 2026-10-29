import { handleAssistantQuery } from '../services/assistantService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const chatAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return errorResponse(res, 'Please provide a message or question.', 400);
    }

    const response = await handleAssistantQuery({
      query: message,
      user: req.user || null
    });

    return successResponse(res, response, 'Assistant response generated.');
  } catch (err) {
    next(err);
  }
};
