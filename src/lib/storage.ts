import type { Campaign } from '../types/campaign';

const STORAGE_KEY = 'emailchamp_campaigns';

export function loadCampaigns(): Campaign[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading campaigns:', error);
    return [];
  }
}

export function saveCampaign(campaign: Campaign): void {
  try {
    const campaigns = loadCampaigns();
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
    
    if (existingIndex >= 0) {
      campaigns[existingIndex] = campaign;
    } else {
      campaigns.push(campaign);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (error) {
    console.error('Error saving campaign:', error);
  }
}

export function deleteCampaign(id: string): void {
  try {
    const campaigns = loadCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting campaign:', error);
  }
}