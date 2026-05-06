const Generation = require('../models/Generation');
const User = require('../models/User');
const { streamGeneratedContent, validateGeneratorPayload } = require('../services/openaiService');

const LIMIT_REACHED_MESSAGE = "You've reached your free limit. Upgrade to Pro!";

function sendSseEvent(res, eventName, data) {
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function generateByType(req, res, type) {
  try {
    const validationMessage = validateGeneratorPayload(type, req.body);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(401).json({ message: 'User account was not found.' });
    }

    if (currentUser.generationsUsed >= currentUser.generationsLimit) {
      return res.status(403).json({
        code: 'LIMIT_REACHED',
        message: LIMIT_REACHED_MESSAGE,
        usage: {
          generationsUsed: currentUser.generationsUsed,
          generationsLimit: currentUser.generationsLimit,
        },
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    const abortController = new AbortController();
    let requestClosed = false;

    const handleConnectionClose = () => {
      if (!res.writableEnded) {
        requestClosed = true;
        abortController.abort();
      }
    };

    req.on('aborted', handleConnectionClose);
    res.on('close', handleConnectionClose);

    sendSseEvent(res, 'start', { message: 'Generation started.' });

    const { output, prompt } = await streamGeneratedContent({
      type,
      payload: req.body,
      signal: abortController.signal,
      onToken: (token) => {
        if (!requestClosed) {
          sendSseEvent(res, 'token', { token });
        }
      },
    });

    if (requestClosed) {
      return undefined;
    }

    if (!output) {
      sendSseEvent(res, 'error', { message: 'No content was generated. Please try again.' });
      res.end();
      return undefined;
    }

    const generation = await Generation.create({
      userId: currentUser._id,
      type,
      prompt,
      output,
    });

    currentUser.generationsUsed += 1;
    await currentUser.save();

    sendSseEvent(res, 'done', {
      message: 'Generation saved to history.',
      generation: {
        _id: generation._id,
        type: generation.type,
        title: generation.title,
        createdAt: generation.createdAt,
      },
      usage: {
        generationsUsed: currentUser.generationsUsed,
        generationsLimit: currentUser.generationsLimit,
      },
    });

    res.end();
    return undefined;
  } catch (error) {
    console.error(`Generate ${type} controller error:`, error);

    if (!res.headersSent) {
      return res.status(500).json({ message: 'Unable to generate content right now.' });
    }

    if (error.name !== 'AbortError') {
      sendSseEvent(res, 'error', { message: 'Unable to generate content right now.' });
    }

    res.end();
    return undefined;
  }
}

const generateResume = (req, res) => generateByType(req, res, 'resume');
const generateEmail = (req, res) => generateByType(req, res, 'email');
const generateBlog = (req, res) => generateByType(req, res, 'blog');

module.exports = {
  generateResume,
  generateEmail,
  generateBlog,
};
