'use client';
import * as React from 'react';

export interface AiHelperContextValue {
  open: () => void;
  isEnabled: boolean;
  isOffline: boolean;
  isGeminiNanoAvailable: boolean;
}

export const AiHelperContext = React.createContext<AiHelperContextValue | null>(null);

export function useAiHelperContext(): AiHelperContextValue | null {
  return React.useContext(AiHelperContext);
}
