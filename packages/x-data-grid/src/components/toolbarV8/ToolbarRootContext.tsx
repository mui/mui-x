import * as React from 'react';

export interface ToolbarRootContextValue {
  focusableItemId: string | null;
  registerItem: (itemId: string) => void;
  unregisterItem: (itemId: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const ToolbarRootContext = React.createContext<ToolbarRootContextValue | undefined>(
  undefined,
);

export function useToolbarRootContext() {
  const context = React.useContext(ToolbarRootContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Toolbar parts must be placed within <Grid.Toolbar.Root>.',
    );
  }

  return context;
}
