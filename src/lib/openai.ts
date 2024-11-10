import OpenAI from 'openai';
import { config } from '../config/env';
import type { BusinessInfo } from '../types/business';
import { EMAIL_TEMPLATE } from '../templates/emailTemplate';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  dangerouslyAllowBrowser: true
});

async function generateWelcomeMessage(info: BusinessInfo): Promise<string> {
  const prompt = `Generate a welcoming and professional email message for ${info.name}. 
Business description: ${info.description}
Key points to include:
- Warm welcome
- Brief mention of their services/value proposition
- Professional tone
- Call to action
Keep it concise (2-3 sentences).`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 150,
  });

  return completion.choices[0].message.content || '';
}

export async function generateEmail(info: BusinessInfo): Promise<string> {
  try {
    const welcomeMessage = await generateWelcomeMessage(info);
    
    return EMAIL_TEMPLATE
      .replace(/{{backgroundUrl}}/g, info.backgroundUrl)
      .replace(/{{logoUrl}}/g, info.logoUrl)
      .replace(/{{name}}/g, info.name)
      .replace(/{{welcomeMessage}}/g, welcomeMessage)
      .replace(/{{address}}/g, info.address)
      .replace(/{{phone}}/g, info.phone)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('Failed to generate email content');
  }
}