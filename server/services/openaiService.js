const OpenAI = require('openai');

const EMAIL_TYPES = ['Cold Outreach', 'Follow-up', 'Thank You', 'Proposal'];
const BLOG_TONES = ['Professional', 'Casual', 'Persuasive', 'Educational'];
const BLOG_WORD_COUNTS = ['300', '500', '800', '1000'];

let openaiClient;

function buildOptionalPromptAdditions(payload) {
  const optionalLines = [];
  const templateLabel = sanitizeText(payload.templateLabel);
  const stylePreference = sanitizeText(payload.stylePreference);
  const refineInstruction = sanitizeText(payload.refineInstruction);
  const existingOutput = sanitizeText(payload.existingOutput);

  if (templateLabel) {
    optionalLines.push(`Template Used: ${templateLabel}`);
  }

  if (stylePreference) {
    optionalLines.push(`Style Preference: ${stylePreference}`);
  }

  if (refineInstruction) {
    optionalLines.push(`Revision Request: ${refineInstruction}`);
  }

  if (existingOutput) {
    optionalLines.push('Current Draft:');
    optionalLines.push(existingOutput);
  }

  return optionalLines.length > 0 ? `\n${optionalLines.join('\n')}` : '';
}

const generatorConfigs = {
  resume: {
    systemPrompt:
      "You are an expert resume writer. Create a professional, ATS-optimized resume based on the user's information. Format it cleanly with sections: Summary, Skills, Experience, Education. Use strong action verbs.",
    requiredFields: [
      'fullName',
      'jobTitle',
      'yearsOfExperience',
      'keySkills',
      'workExperience',
    ],
    buildPrompt: (payload) => [
      `Full Name: ${sanitizeText(payload.fullName)}`,
      `Target Job Title: ${sanitizeText(payload.jobTitle)}`,
      `Years of Experience: ${sanitizeText(payload.yearsOfExperience)}`,
      `Key Skills: ${sanitizeText(payload.keySkills)}`,
      `Work Experience: ${sanitizeText(payload.workExperience)}`,
    ].join('\n') + buildOptionalPromptAdditions(payload),
  },
  email: {
    systemPrompt:
      'You are a professional email copywriter. Write a concise, persuasive, and professional email based on the context provided. Keep it under 200 words unless requested otherwise.',
    requiredFields: ['emailType', 'recipientRole', 'yourName', 'contextPurpose'],
    validate: (payload) => {
      if (!EMAIL_TYPES.includes(payload.emailType)) {
        return `Email Type must be one of: ${EMAIL_TYPES.join(', ')}.`;
      }

      return null;
    },
    buildPrompt: (payload) => [
      `Email Type: ${sanitizeText(payload.emailType)}`,
      `Recipient Role: ${sanitizeText(payload.recipientRole)}`,
      `Your Name: ${sanitizeText(payload.yourName)}`,
      `Context/Purpose: ${sanitizeText(payload.contextPurpose)}`,
    ].join('\n') + buildOptionalPromptAdditions(payload),
  },
  blog: {
    systemPrompt:
      'You are an expert content writer and SEO specialist. Write a well-structured blog post with an engaging headline, introduction, subheadings, and conclusion. Make it valuable and readable.',
    requiredFields: ['blogTopic', 'targetAudience', 'tone', 'wordCount'],
    validate: (payload) => {
      if (!BLOG_TONES.includes(payload.tone)) {
        return `Tone must be one of: ${BLOG_TONES.join(', ')}.`;
      }

      if (!BLOG_WORD_COUNTS.includes(String(payload.wordCount))) {
        return `Word Count must be one of: ${BLOG_WORD_COUNTS.join(', ')}.`;
      }

      return null;
    },
    buildPrompt: (payload) => [
      `Blog Topic: ${sanitizeText(payload.blogTopic)}`,
      `Target Audience: ${sanitizeText(payload.targetAudience)}`,
      `Tone: ${sanitizeText(payload.tone)}`,
      `Desired Word Count: ${sanitizeText(payload.wordCount)}`,
    ].join('\n') + buildOptionalPromptAdditions(payload),
  },
};

function sanitizeText(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getOpenAIClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
  }

  return openaiClient;
}

function validateGeneratorPayload(type, payload) {
  const config = generatorConfigs[type];

  if (!config) {
    return 'Unsupported generator type.';
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return 'Request body must be a valid JSON object.';
  }

  for (const field of config.requiredFields) {
    if (!sanitizeText(payload[field])) {
      return `Field "${field}" is required.`;
    }
  }

  if (typeof config.validate === 'function') {
    return config.validate(payload);
  }

  return null;
}

async function streamGeneratedContent({ type, payload, onToken, signal }) {
  const config = generatorConfigs[type];

  if (!config) {
    throw new Error('Unsupported generator type.');
  }

  const userPrompt = config.buildPrompt(payload);
  const client = getOpenAIClient();

  const stream = await client.chat.completions.create(
    {
      model: 'gemini-2.5-flash',
      stream: true,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: config.systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    },
    {
      signal,
    }
  );

  let output = '';

  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content || '';

    if (token) {
      output += token;

      if (typeof onToken === 'function') {
        onToken(token);
      }
    }
  }

  return {
    prompt: userPrompt,
    output: output.trim(),
  };
}

module.exports = {
  BLOG_TONES,
  BLOG_WORD_COUNTS,
  EMAIL_TYPES,
  validateGeneratorPayload,
  streamGeneratedContent,
};
