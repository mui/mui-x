import * as React from 'react';

export interface GridToolbarRootContextValue {
  focusableItemId: string | null;
  registerItem: (itemId: string) => void;
  unregisterItem: (itemId: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const GridToolbarRootContext = React.createContext<GridToolbarRootContextValue | undefined>(
  undefined,
);

export function useGridToolbarRootContext() {
  const context = React.useContext(GridToolbarRootContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Toolbar parts must be placed within <Grid.Toolbar.Root>.',
    );
  }

  return context;
}
