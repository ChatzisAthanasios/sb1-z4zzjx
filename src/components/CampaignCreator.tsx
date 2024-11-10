import React, { useState } from 'react';
import { RefreshCcw, ArrowRight, Calendar, Clock, Eye, Wand2, ListFilter } from 'lucide-react';
import type { Campaign } from '../types/campaign';
import { generateCampaignSequence } from '../lib/campaign';
import { CampaignPreview } from './CampaignPreview';
import { saveCampaign } from '../lib/storage';

interface CampaignInfo {
  businessName: string;
  industry: string;
  productDescription: string;
  targetAudience: string;
  campaignGoal: string;
  emailCount: number;
}

export function CampaignCreator() {
  const [step, setStep] = useState<'form' | 'sequence'>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const info: CampaignInfo = {
      businessName: formData.get('businessName') as string,
      industry: formData.get('industry') as string || '',
      productDescription: formData.get('productDescription') as string || '',
      targetAudience: formData.get('targetAudience') as string || '',
      campaignGoal: formData.get('campaignGoal') as string,
      emailCount: parseInt(formData.get('emailCount') as string, 10),
    };

    setCampaignInfo(info);

    try {
      const sequence = await generateCampaignSequence(info);
      // Add business info to each campaign
      const enrichedSequence = sequence.map(campaign => ({
        ...campaign,
        businessName: info.businessName,
        industry: info.industry,
        productDescription: info.productDescription,
        targetAudience: info.targetAudience
      }));
      
      // Save each campaign to storage
      enrichedSequence.forEach(campaign => {
        saveCampaign(campaign);
      });

      setCampaigns(enrichedSequence);
      setStep('sequence');
      setSuccessMessage('Campaign sequence generated and saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate sequence');
      console.error('Failed to generate sequence:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateEmail = async (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign || !campaignInfo) return;

    setIsRegenerating(id);
    try {
      const newContent = await generateCampaignSequence({ 
        ...campaignInfo,
        emailCount: 1
      });
      
      const updatedCampaign = {
        ...campaign,
        ...newContent[0],
        businessName: campaignInfo.businessName,
        industry: campaignInfo.industry,
        productDescription: campaignInfo.productDescription,
        targetAudience: campaignInfo.targetAudience
      };

      saveCampaign(updatedCampaign);
      
      setCampaigns(prev => prev.map(c => 
        c.id === id ? updatedCampaign : c
      ));
    } catch (error) {
      console.error('Failed to regenerate email:', error);
    } finally {
      setIsRegenerating(null);
    }
  };

  const handlePreview = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsPreviewOpen(true);
  };

  const generateEmailDescription = (campaign: Campaign) => {
    if (!campaignInfo) return '';

    let description = `Business Name: ${campaignInfo.businessName}\n`;
    
    if (campaignInfo.industry) {
      description += `Industry: ${campaignInfo.industry}\n\n`;
    }

    if (campaignInfo.productDescription) {
      description += `Business Description:\n${campaignInfo.productDescription}\n\n`;
    }

    if (campaignInfo.targetAudience) {
      description += `Target Audience:\n${campaignInfo.targetAudience}\n\n`;
    }

    description += `Campaign Goal:\n${campaignInfo.campaignGoal}\n\n`;
    description += `Email Purpose:\n${campaign.purpose}\n\n`;
    description += `Email Content:\n${campaign.content}`;

    return description;
  };

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Campaign Sequence Creator</h2>
            <p className="mt-2 text-lg text-gray-600">Tell us about your business and campaign goals</p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
                  Product/Service Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="productDescription"
                  id="productDescription"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                  Target Audience <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="targetAudience"
                  id="targetAudience"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="campaignGoal" className="block text-sm font-medium text-gray-700">
                  Campaign Goal <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="campaignGoal"
                  id="campaignGoal"
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="emailCount" className="block text-sm font-medium text-gray-700">
                  Number of Emails in Sequence <span className="text-red-500">*</span>
                </label>
                <select
                  name="emailCount"
                  id="emailCount"
                  required
                  defaultValue="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {[3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num} emails</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating Sequence...
                  </>
                ) : (
                  'Generate Campaign Sequence'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Your Campaign Sequence</h2>
          <p className="mt-2 text-lg text-gray-600">Review and customize your email campaign sequence</p>
          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaignInfo?.businessName}</h3>
                <p className="text-sm text-gray-500">{campaignInfo?.industry}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.location.href = '/?tab=manager'}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ListFilter className="w-4 h-4 mr-2" />
                  Go to Campaign Manager
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Step</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign, index) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{campaign.businessName}</div>
                      <div className="text-sm text-gray-500">{campaign.industry}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Sequence {index + 1}/{campaigns.length}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Step {campaign.sendDay}</div>
                      <div className="text-sm text-gray-500">{campaign.purpose}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {campaign.subject}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Day {campaign.sendDay}</div>
                      <div className="text-sm text-gray-500">{campaign.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePreview(campaign)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => regenerateEmail(campaign.id)}
                          disabled={isRegenerating === campaign.id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50"
                        >
                          <RefreshCcw className={`w-4 h-4 mr-1 ${isRegenerating === campaign.id ? 'animate-spin' : ''}`} />
                          {isRegenerating === campaign.id ? 'Generating...' : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => {
                            const description = generateEmailDescription(campaign);
                            window.location.href = `/?description=${encodeURIComponent(description)}`;
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Generate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setStep('form')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Campaign
          </button>
        </div>
      </div>

      {selectedCampaign && (
        <CampaignPreview
          content={selectedCampaign.content}
          subject={selectedCampaign.subject}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedCampaign(null);
          }}
        />
      )}
    </div>
  );
}