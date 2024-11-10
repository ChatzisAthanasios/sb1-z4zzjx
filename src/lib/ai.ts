import { config } from '../config/env';
import type { BusinessInfo } from '../types/business';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function generateWithClaude(info: BusinessInfo, template: string): Promise<string> {
  const prompt = `Generate an email in the exact format, structure and code on the template provided below:

${template}

Please ensure the email matches EXACTLY the HTML structure and visual design of the template above. The email should appear as visually identical to the template as possible.Create only the email dont write comments before or after that.

Here's all the information to use:

${info.description}

Additional details (if provided):
${info.address ? `Address: ${info.address}` : ''}
${info.phone ? `Phone: ${info.phone}` : ''}
${info.backgroundUrl ? `Background Image: ${info.backgroundUrl}` : ''}
${info.logoUrl ? `Logo URL: ${info.logoUrl}` : ''}

Important:
- Maintain the exact HTML structure
- Keep all CSS styles unchanged
- Extract and use any URLs mentioned in the description for images
- Create a matching footer like mailchimp
- Use all provided information to create a comprehensive email`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openrouterApiKey}`,
        'HTTP-Referer': config.openrouterReferrer,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet-20240620',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw new Error('Failed to generate content with Claude');
  }
}

export async function generateEmail(info: BusinessInfo, template: string): Promise<string> {
  try {
    const generatedEmail = await generateWithClaude(info, template);
    
    // If Claude returns just the content, wrap it in the template
    if (!generatedEmail.includes('<!DOCTYPE html>')) {
      return template
        .replace(/{{backgroundUrl}}/g, info.backgroundUrl)
        .replace(/{{logoUrl}}/g, info.logoUrl)
        .replace(/{{name}}/g, info.name)
        .replace(/{{welcomeMessage}}/g, generatedEmail)
        .replace(/{{address}}/g, info.address)
        .replace(/{{phone}}/g, info.phone)
        .replace(/{{year}}/g, new Date().getFullYear().toString());
    }
    
    // If Claude returns a complete email, use it directly
    return generatedEmail
      .replace(/{{backgroundUrl}}/g, info.backgroundUrl)
      .replace(/{{logoUrl}}/g, info.logoUrl)
      .replace(/{{name}}/g, info.name)
      .replace(/{{address}}/g, info.address)
      .replace(/{{phone}}/g, info.phone)
      .replace(/{{year}}/g, new Date().getFullYear().toString());
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error('Failed to generate email content');
  }
}