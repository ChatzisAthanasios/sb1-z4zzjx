import React from 'react';
import { X } from 'lucide-react';
import type { ComponentType } from '../../types/editor';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentType[];
}

export function PreviewModal({ isOpen, onClose, components }: PreviewModalProps) {
  if (!isOpen) return null;

  const renderPreviewContent = () => {
    return components.map((component) => {
      switch (component.type) {
        case 'heading':
          return React.createElement(
            component.defaultProps.level || 'h1',
            { key: component.id, className: 'text-2xl font-bold mb-4' },
            component.defaultProps.text
          );

        case 'paragraph':
          return (
            <p key={component.id} className="mb-4">
              {component.defaultProps.text}
            </p>
          );

        case 'image':
          return (
            <img
              key={component.id}
              src={component.defaultProps.src}
              alt={component.defaultProps.alt}
              className="max-w-full h-auto mb-4"
            />
          );

        case 'button':
          return (
            <a
              key={component.id}
              href={component.defaultProps.url}
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4"
            >
              {component.defaultProps.text}
            </a>
          );

        case 'divider':
          return <hr key={component.id} className="my-4 border-gray-200" />;

        case 'spacer':
          return (
            <div
              key={component.id}
              style={{ height: `${component.defaultProps.height}px` }}
            />
          );

        case 'columns':
          return (
            <div key={component.id} className="grid grid-cols-2 gap-4 mb-4">
              <div>Column 1</div>
              <div>Column 2</div>
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Preview</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto bg-white">
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  );
}