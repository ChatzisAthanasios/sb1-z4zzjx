import React, { useState } from 'react';
import { Upload, X, Code } from 'lucide-react';

interface TemplateUploadProps {
  onTemplateChange: (template: string) => void;
  defaultTemplate: string;
}

export function TemplateUpload({ onTemplateChange, defaultTemplate }: TemplateUploadProps) {
  const [template, setTemplate] = useState(defaultTemplate);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTemplate(content);
      onTemplateChange(content);
    };
    reader.readAsText(file);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(e.target.value);
    onTemplateChange(e.target.value);
  };

  const resetTemplate = () => {
    setTemplate(defaultTemplate);
    onTemplateChange(defaultTemplate);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Email Template
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Code className="w-4 h-4 mr-1" />
            {isEditing ? 'Preview' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={resetTemplate}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={template}
          onChange={handleTemplateChange}
          className="w-full h-[300px] font-mono text-sm p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      ) : (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a template</span>
                <input
                  type="file"
                  accept=".html"
                  className="sr-only"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">HTML files only</p>
          </div>
        </div>
      )}
    </div>
  );
}