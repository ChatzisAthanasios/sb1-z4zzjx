import React from 'react';
import { useDrop } from 'react-dnd';
import { ComponentRenderer } from './ComponentRenderer';
import type { ComponentType } from '../../types/editor';

interface CanvasProps {
  components: ComponentType[];
  selectedComponent: string | null;
  onSelect: (id: string | null) => void;
  onDrop: (item: ComponentType, index: number) => void;
  onUpdate: (id: string, updates: Partial<ComponentType>) => void;
  onDelete: (id: string) => void;
}

export function Canvas({
  components,
  selectedComponent,
  onSelect,
  onDrop,
  onUpdate,
  onDelete
}: CanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: ComponentType, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Calculate drop index based on mouse position
      const canvasElement = document.getElementById('email-canvas');
      if (!canvasElement) return;

      const componentElements = Array.from(
        canvasElement.getElementsByClassName('email-component')
      );
      
      let dropIndex = components.length;
      for (let i = 0; i < componentElements.length; i++) {
        const rect = componentElements[i].getBoundingClientRect();
        if (clientOffset.y < rect.bottom) {
          dropIndex = i;
          break;
        }
      }

      onDrop(item, dropIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div
      id="email-canvas"
      ref={drop}
      className={`min-h-full p-8 ${isOver ? 'bg-indigo-50' : 'bg-gray-50'}`}
    >
      <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        {components.map((component, index) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            isSelected={selectedComponent === component.id}
            onSelect={() => onSelect(component.id)}
            onUpdate={(updates) => onUpdate(component.id, updates)}
            onDelete={() => onDelete(component.id)}
          />
        ))}
        {components.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Drag and drop components here
          </div>
        )}
      </div>
    </div>
  );
}