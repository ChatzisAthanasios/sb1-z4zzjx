import React from 'react';
import { Download, Copy, Check } from 'lucide-react';
import type { BusinessInfo } from '../types/business';

interface EmailPreviewProps {
  html: string;
  isGenerating: boolean;
  businessInfo: BusinessInfo | null;
  error: string | null;
}

export function EmailPreview({ html, isGenerating, businessInfo, error }: EmailPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessInfo?.name.toLowerCase().replace(/\s+/g, '-')}-email.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!businessInfo || !html) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Fill in the business information and generate to see your email preview
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy HTML'}
        </button>
        <button
          onClick={downloadHTML}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Download HTML
        </button>
      </div>
      <div 
        className="border rounded-lg overflow-hidden bg-gray-50"
        style={{ height: '600px' }}
      >
        <iframe
          srcDoc={html}
          title="Email Preview"
          className="w-full h-full"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}