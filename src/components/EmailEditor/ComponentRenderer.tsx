import React from 'react';
import { Trash2, Move } from 'lucide-react';
import type { ComponentType } from '../../types/editor';

interface ComponentRendererProps {
  component: ComponentType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ComponentType>) => void;
  onDelete: () => void;
}

export function ComponentRenderer({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}: ComponentRendererProps) {
  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <div className="p-4">
            <input
              type="text"
              value={component.defaultProps.text}
              onChange={(e) =>
                onUpdate({ defaultProps: { ...component.defaultProps, text: e.target.value } })
              }
              className={`w-full text-2xl font-bold border-0 focus:ring-0 ${
                isSelected ? 'bg-blue-50' : 'bg-transparent'
              }`}
            />
          </div>
        );

      case 'paragraph':
        return (
          <div className="p-4">
            <textarea
              value={component.defaultProps.text}
              onChange={(e) =>
                onUpdate({ defaultProps: { ...component.defaultProps, text: e.target.value } })
              }
              className={`w-full resize-none border-0 focus:ring-0 ${
                isSelected ? 'bg-blue-50' : 'bg-transparent'
              }`}
              rows={3}
            />
          </div>
        );

      case 'image':
        return (
          <div className="p-4">
            <input
              type="url"
              placeholder="Image URL"
              value={component.defaultProps.src}
              onChange={(e) =>
                onUpdate({ defaultProps: { ...component.defaultProps, src: e.target.value } })
              }
              className="w-full mb-2 border-gray-300 rounded-md"
            />
            {component.defaultProps.src && (
              <img
                src={component.defaultProps.src}
                alt={component.defaultProps.alt}
                className="max-w-full h-auto"
              />
            )}
          </div>
        );

      case 'button':
        return (
          <div className="p-4">
            <input
              type="text"
              placeholder="Button text"
              value={component.defaultProps.text}
              onChange={(e) =>
                onUpdate({ defaultProps: { ...component.defaultProps, text: e.target.value } })
              }
              className="w-full mb-2 border-gray-300 rounded-md"
            />
            <input
              type="url"
              placeholder="Button URL"
              value={component.defaultProps.url}
              onChange={(e) =>
                onUpdate({ defaultProps: { ...component.defaultProps, url: e.target.value } })
              }
              className="w-full border-gray-300 rounded-md"
            />
          </div>
        );

      case 'divider':
        return <hr className="my-4 border-gray-200" />;

      case 'spacer':
        return (
          <div
            style={{ height: `${component.defaultProps.height}px` }}
            className="bg-gray-50"
          />
        );

      case 'columns':
        return (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="border border-dashed border-gray-300 p-4 rounded">
              Column 1
            </div>
            <div className="border border-dashed border-gray-300 p-4 rounded">
              Column 2
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`email-component relative group ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 flex items-center space-x-1 p-1 bg-white shadow-sm rounded-bl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <div className="p-1 cursor-move">
            <Move className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
      {renderComponent()}
    </div>
  );
}