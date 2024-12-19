import * as React from 'react';

export interface GridQuickFilterState {
  value: string;
}

export interface GridQuickFilterRootContextValue extends GridQuickFilterState {
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue: () => void;
  controlRef: React.RefObject<HTMLInputElement>;
}

export const GridQuickFilterRootContext = React.createContext<
  GridQuickFilterRootContextValue | undefined
>(undefined);

export function useGridQuickFilterRootContext() {
  const context = React.useContext(GridQuickFilterRootContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Quick Filter parts must be placed within <Grid.QuickFilter.Root>.',
    );
  }

  return context;
}
