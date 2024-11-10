import React from 'react';
import { useDrag } from 'react-dnd';
import { Type, Image, Columns, Button, Divide, Square } from 'lucide-react';
import type { ComponentType } from '../../types/editor';

const COMPONENTS: ComponentType[] = [
  {
    type: 'heading',
    icon: Type,
    label: 'Heading',
    defaultProps: { level: 'h1', text: 'New Heading' }
  },
  {
    type: 'paragraph',
    icon: Type,
    label: 'Paragraph',
    defaultProps: { text: 'New paragraph text' }
  },
  {
    type: 'image',
    icon: Image,
    label: 'Image',
    defaultProps: { src: '', alt: '' }
  },
  {
    type: 'button',
    icon: Button,
    label: 'Button',
    defaultProps: { text: 'Click me', url: '#' }
  },
  {
    type: 'divider',
    icon: Divide,
    label: 'Divider',
    defaultProps: {}
  },
  {
    type: 'spacer',
    icon: Square,
    label: 'Spacer',
    defaultProps: { height: 20 }
  },
  {
    type: 'columns',
    icon: Columns,
    label: '2 Columns',
    defaultProps: { columns: 2 }
  }
];

export function ComponentPanel() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Components</h3>
      <div className="space-y-2">
        {COMPONENTS.map((component) => (
          <DraggableComponent key={component.type} component={component} />
        ))}
      </div>
    </div>
  );
}

function DraggableComponent({ component }: { component: ComponentType }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: component,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const Icon = component.icon;

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 rounded-md border border-gray-200 bg-white cursor-move hover:border-indigo-500 hover:shadow-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className="w-4 h-4 text-gray-500 mr-2" />
      <span className="text-sm text-gray-700">{component.label}</span>
    </div>
  );
}