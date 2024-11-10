import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Undo, Redo, Layout } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditorToolbar } from './EditorToolbar';
import { ComponentPanel } from './ComponentPanel';
import { Canvas } from './Canvas';
import { PreviewModal } from './PreviewModal';
import { useAutosave } from '../../hooks/useAutosave';
import type { EmailTemplate, ComponentType } from '../../types/editor';

interface EmailEditorProps {
  emailId: string;
  onClose: () => void;
}

export function EmailEditor({ emailId, onClose }: EmailEditorProps) {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { save, lastSaved } = useAutosave(components, emailId);

  const handleDrop = (item: ComponentType, index: number) => {
    setComponents(prev => {
      const newComponents = [...prev];
      newComponents.splice(index, 0, { ...item, id: Date.now().toString() });
      return newComponents;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await save();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComponentUpdate = (id: string, updates: Partial<ComponentType>) => {
    setComponents(prev =>
      prev.map(comp => (comp.id === id ? { ...comp, ...updates } : comp))
    );
  };

  const handleDelete = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    setSelectedComponent(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 bg-gray-100 z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">Email Editor</h2>
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Panel */}
          <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
            <ComponentPanel />
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto">
            <Canvas
              components={components}
              selectedComponent={selectedComponent}
              onSelect={setSelectedComponent}
              onDrop={handleDrop}
              onUpdate={handleComponentUpdate}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Preview Modal */}
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          components={components}
        />
      </div>
    </DndProvider>
  );
}