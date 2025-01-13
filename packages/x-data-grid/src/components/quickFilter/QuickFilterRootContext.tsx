import * as React from 'react';

export interface QuickFilterState {
  value: string;
}

export interface QuickFilterRootContextValue {
  state: QuickFilterState;
  controlRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue: () => void;
}

export const QuickFilterRootContext = React.createContext<QuickFilterRootContextValue | undefined>(
  undefined,
);

export function useQuickFilterRootContext() {
  const context = React.useContext(QuickFilterRootContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Quick Filter parts must be placed within <Grid.QuickFilter.Root>.',
    );
  }

  return context;
}
