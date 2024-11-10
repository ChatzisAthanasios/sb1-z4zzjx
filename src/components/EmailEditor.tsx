import React, { useState, useEffect } from 'react';
import { X, Type, Image, Layout, Square, Save } from 'lucide-react';
import { loadCampaigns, saveCampaign } from '../lib/storage';
import type { Campaign } from '../types/campaign';

interface EmailEditorProps {
  emailId: string;
  onClose: () => void;
}

interface Block {
  id: string;
  type: 'text' | 'image' | 'button' | 'spacer';
  content: string;
}

export function EmailEditor({ emailId, onClose }: EmailEditorProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  useEffect(() => {
    const campaigns = loadCampaigns();
    const currentCampaign = campaigns.find(c => c.id === emailId);
    if (currentCampaign) {
      setCampaign(currentCampaign);
      // Initialize blocks from campaign content
      const parser = new DOMParser();
      const doc = parser.parseFromString(currentCampaign.content, 'text/html');
      const contentDiv = doc.querySelector('.content');
      if (contentDiv) {
        const initialBlocks: Block[] = Array.from(contentDiv.children).map((child, index) => ({
          id: `block-${index}`,
          type: child.tagName.toLowerCase() === 'img' ? 'image' : 'text',
          content: child.tagName.toLowerCase() === 'img' 
            ? (child as HTMLImageElement).src 
            : child.innerHTML
        }));
        setBlocks(initialBlocks);
      }
    }
  }, [emailId]);

  const handleDragStart = (e: React.DragEvent, type: Block['type']) => {
    e.dataTransfer.setData('blockType', type);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('blockType') as Block['type'];
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'text' ? 'New text block' : 
               type === 'image' ? 'https://via.placeholder.com/400x200' :
               type === 'button' ? 'Click me' : ''
    };
    setBlocks(prev => [...prev, newBlock]);
    setIsDragging(false);
  };

  const handleBlockContentChange = (id: string, content: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const handleSave = () => {
    if (!campaign) return;

    // Convert blocks back to HTML
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${campaign.subject}</title>
          <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background-image: url('${campaign.backgroundUrl || ''}'); background-size: cover; padding: 40px 20px; text-align: center; }
              .content { padding: 40px 20px; background: #ffffff; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  ${campaign.logoUrl ? `<img src="${campaign.logoUrl}" alt="${campaign.businessName}" class="logo">` : ''}
              </div>
              <div class="content">
                  ${blocks.map(block => {
                    switch (block.type) {
                      case 'text':
                        return `<div>${block.content}</div>`;
                      case 'image':
                        return `<img src="${block.content}" alt="" style="max-width: 100%; height: auto;">`;
                      case 'button':
                        return `<button style="background: #4F46E5; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer;">${block.content}</button>`;
                      case 'spacer':
                        return '<div style="height: 20px;"></div>';
                      default:
                        return '';
                    }
                  }).join('\n')}
              </div>
              <div class="footer">
                  <p>${campaign.businessName}</p>
                  ${campaign.address ? `<p>${campaign.address}</p>` : ''}
                  ${campaign.phone ? `<p>${campaign.phone}</p>` : ''}
                  <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const updatedCampaign = { ...campaign, content };
    saveCampaign(updatedCampaign);
    onClose();
  };

  if (!campaign) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Components</h3>
          <div className="space-y-2">
            <div
              draggable
              onDragStart={e => handleDragStart(e, 'text')}
              className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <Type className="w-5 h-5 mr-3 text-gray-500" />
              Text Block
            </div>
            <div
              draggable
              onDragStart={e => handleDragStart(e, 'image')}
              className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <Image className="w-5 h-5 mr-3 text-gray-500" />
              Image
            </div>
            <div
              draggable
              onDragStart={e => handleDragStart(e, 'button')}
              className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <Square className="w-5 h-5 mr-3 text-gray-500" />
              Button
            </div>
            <div
              draggable
              onDragStart={e => handleDragStart(e, 'spacer')}
              className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <Layout className="w-5 h-5 mr-3 text-gray-500" />
              Spacer
            </div>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto p-8">
        <div 
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg min-h-[800px] p-8"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {blocks.map(block => (
            <div
              key={block.id}
              className={`mb-4 p-2 rounded-lg ${selectedBlock === block.id ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedBlock(block.id)}
            >
              {block.type === 'text' && (
                <div
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: block.content }}
                  onBlur={e => handleBlockContentChange(block.id, e.currentTarget.innerHTML)}
                  className="outline-none"
                />
              )}
              {block.type === 'image' && (
                <img
                  src={block.content}
                  alt=""
                  className="max-w-full h-auto"
                  onClick={() => {
                    const url = prompt('Enter image URL:', block.content);
                    if (url) handleBlockContentChange(block.id, url);
                  }}
                />
              )}
              {block.type === 'button' && (
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  onClick={() => {
                    const text = prompt('Enter button text:', block.content);
                    if (text) handleBlockContentChange(block.id, text);
                  }}
                >
                  {block.content}
                </button>
              )}
              {block.type === 'spacer' && (
                <div className="h-8 bg-gray-100 rounded-lg" />
              )}
            </div>
          ))}
          {blocks.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Drag and drop components here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}