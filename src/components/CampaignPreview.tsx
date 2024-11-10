import React from 'react';
import { X } from 'lucide-react';

interface CampaignPreviewProps {
  content: string;
  subject: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignPreview({ content, subject, isOpen, onClose }: CampaignPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Email Preview</h3>
            <p className="text-sm text-gray-600">Subject: {subject}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <iframe
            srcDoc={content}
            title="Email Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}