'use client';
import * as React from 'react';

export interface SuggestionsContextValue {
  onSelect: (value: string) => void;
}

export const SuggestionsContext = React.createContext<SuggestionsContextValue | null>(null);

export function useSuggestionsContext(): SuggestionsContextValue | null {
  return React.useContext(SuggestionsContext);
}
