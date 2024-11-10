import React, { useState, useEffect } from 'react';
import { Inbox, Calendar, Users, BarChart2, Eye, Trash2, Edit2, Tags } from 'lucide-react';
import { CampaignPreview } from './CampaignPreview';
import { EmailEditor } from './EmailEditor';
import type { Campaign } from '../types/campaign';
import { loadCampaigns, saveCampaign, deleteCampaign } from '../lib/storage';

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const loadedCampaigns = loadCampaigns();
    setCampaigns(loadedCampaigns);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStats = () => {
    return {
      total: campaigns.length,
      active: campaigns.filter(c => true).length,
      completed: campaigns.filter(c => false).length,
      engagement: '85%'
    };
  };

  const stats = getStats();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaignId(campaign.id);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingCampaignId(null);
    // Reload campaigns to get updated content
    setCampaigns(loadCampaigns());
  };

  const getCampaignType = (campaign: Campaign): string => {
    const types = [
      'seasonal', 'educational', 'reengage', 'engage', 'informational',
      'transactional', 'promotional', 'welcome', 'newsletter'
    ];
    
    const content = campaign.content.toLowerCase();
    const subject = campaign.subject.toLowerCase();
    
    if (subject.includes('welcome') || content.includes('welcome')) return 'welcome';
    if (subject.includes('season') || content.includes('season')) return 'seasonal';
    if (subject.includes('learn') || content.includes('learn')) return 'educational';
    if (subject.includes('offer') || content.includes('offer')) return 'promotional';
    if (subject.includes('update') || content.includes('update')) return 'newsletter';
    
    return 'informational';
  };

  const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-5">
          <p className="text-gray-500 text-sm">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Campaign Manager</h2>
        <p className="mt-2 text-gray-600">Manage and track all your email campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Inbox} label="Total Campaigns" value={stats.total} />
        <StatCard icon={Calendar} label="Active Campaigns" value={stats.active} />
        <StatCard icon={Users} label="Completed" value={stats.completed} />
        <StatCard icon={BarChart2} label="Avg. Engagement" value={stats.engagement} />
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Your Campaigns
              </h3>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Campaigns</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Steps
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.businessName}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Tags className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCampaignType(campaign)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index < 3 ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          title={`Email ${index + 1}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setIsPreviewOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(campaign)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {isEditorOpen && editingCampaignId && (
        <EmailEditor
          emailId={editingCampaignId}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}