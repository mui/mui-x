import * as React from 'react';

export interface GridDensityMenuRootContextValue {
  triggerRef: React.RefObject<HTMLButtonElement>;
  value: 'compact' | 'standard' | 'comfortable';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GridDensityMenuRootContext = React.createContext<
  GridDensityMenuRootContextValue | undefined
>(undefined);

export function useGridDensityMenuRootContext() {
  const context = React.useContext(GridDensityMenuRootContext);

  if (!context) {
    throw new Error(
      'MUI X: GridDensityMenuRootContext is missing. GridDensityMenu parts must be placed within a <Grid.ExportMenu.Root>.',
    );
  }

  return context;
}
