'use client';
import * as React from 'react';
import { ScopeDialogContextValue } from './ScopeDialog.types';

export const ScopeDialogContext = React.createContext<ScopeDialogContextValue | null>({
  promptScope: async () => null,
  isOpen: false,
});

export function useScopeDialogContext(): ScopeDialogContextValue {
  const ctx = React.useContext(ScopeDialogContext);
  if (!ctx) {
    throw new Error('useScopeDialogContext must be used within <RecurringScopeDialogProvider />');
  }
  return ctx;
}
