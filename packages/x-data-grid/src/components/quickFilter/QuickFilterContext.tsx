import * as React from 'react';

export interface QuickFilterState {
  value: string;
}

export interface QuickFilterContextValue {
  state: QuickFilterState;
  controlRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue: () => void;
}

export const QuickFilterContext = React.createContext<QuickFilterContextValue | undefined>(
  undefined,
);

export function useQuickFilterContext() {
  const context = React.useContext(QuickFilterContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Quick Filter subcomponents must be placed within a <QuickFilter /> component.',
    );
  }

  return context;
}
