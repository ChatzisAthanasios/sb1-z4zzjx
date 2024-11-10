export interface Campaign {
  id: string;
  subject: string;
  purpose: string;
  reasoning: string;
  sendDay: number;
  delay: number;
  preferredTime: string;
  content: string;
  businessName?: string;
  industry?: string;
  productDescription?: string;
  targetAudience?: string;
  campaignType?: 'welcome' | 'promotional' | 'educational' | 'newsletter' | 'seasonal' | 'reengagement' | 'transactional' | 'informational';
}