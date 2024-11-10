import { LucideIcon } from 'lucide-react';

export interface ComponentType {
  id?: string;
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'spacer' | 'columns';
  icon: LucideIcon;
  label: string;
  defaultProps: {
    text?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    src?: string;
    alt?: string;
    url?: string;
    height?: number;
    columns?: number;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  components: ComponentType[];
  createdAt: number;
  updatedAt: number;
}