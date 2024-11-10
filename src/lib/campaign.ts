import { config } from '../config/env';
import type { Campaign } from '../types/campaign';
import { EMAIL_TEMPLATE } from '../templates/emailTemplate';

interface CampaignInfo {
  businessName: string;
  industry: string;
  productDescription: string;
  targetAudience: string;
  campaignGoal: string;
  emailCount: number;
}

function formatEmailContent(content: string, info: CampaignInfo): string {
  return EMAIL_TEMPLATE
    .replace(/{{name}}/g, info.businessName)
    .replace(/{{welcomeMessage}}/g, content)
    .replace(/{{year}}/g, new Date().getFullYear().toString())
    .replace(/{{backgroundUrl}}/g, 'https://images.unsplash.com/photo-1557683316-973673baf926')
    .replace(/{{logoUrl}}/g, '')
    .replace(/{{address}}/g, '')
    .replace(/{{phone}}/g, '');
}

export async function generateCampaignSequence(info: CampaignInfo): Promise<Campaign[]> {
  const prompt = `Create an email campaign sequence with ${info.emailCount} emails for:

Business: ${info.businessName}
Industry: ${info.industry}
Product/Service: ${info.productDescription}
Target Audience: ${info.targetAudience}
Campaign Goal: ${info.campaignGoal}

For each email, provide:
1. Subject line (compelling and specific)
2. Purpose (clear objective of this email)
3. Reasoning (why this email is important in the sequence)
4. Send day (numbered from 1)
5. Delay after previous email (in days)
6. Preferred send time (e.g., "10:00 AM", "2:00 PM")
7. Email content (professional, engaging, and formatted)

Format as JSON array with objects:
{
  id: "unique-string",
  subject: "string",
  purpose: "string",
  reasoning: "string",
  sendDay: number,
  delay: number,
  preferredTime: "string",
  content: "string"
}

Make each email unique and focused on a specific aspect of the campaign goal.`;

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
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate campaign sequence');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const sequence = JSON.parse(jsonMatch[0]);
    
    // Format each email's content using the template
    return sequence.map((email: Campaign) => ({
      ...email,
      content: formatEmailContent(email.content, info)
    }));
  } catch (error) {
    console.error('Error generating campaign sequence:', error);
    throw new Error('Failed to generate campaign sequence');
  }
}