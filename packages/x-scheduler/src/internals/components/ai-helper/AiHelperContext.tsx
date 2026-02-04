'use client';
import * as React from 'react';

export interface AiHelperContextValue {
  open: () => void;
  isEnabled: boolean;
}

export const AiHelperContext = React.createContext<AiHelperContextValue | null>(null);

export function useAiHelperContext(): AiHelperContextValue | null {
  return React.useContext(AiHelperContext);
}
