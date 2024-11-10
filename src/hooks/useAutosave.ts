import { useEffect, useCallback, useState } from 'react';
import type { ComponentType } from '../types/editor';

export function useAutosave(components: ComponentType[], emailId: string) {
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  const save = useCallback(async () => {
    try {
      // In a real app, this would be an API call
      localStorage.setItem(`email_${emailId}`, JSON.stringify(components));
      setLastSaved(Date.now());
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    }
  }, [components, emailId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      save();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [components, save]);

  return { save, lastSaved };
}