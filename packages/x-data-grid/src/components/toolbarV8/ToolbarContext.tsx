import * as React from 'react';

export interface ToolbarContextValue {
  focusableItemId: string | null;
  registerItem: (itemId: string) => void;
  unregisterItem: (itemId: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const ToolbarContext = React.createContext<ToolbarContextValue | undefined>(undefined);

export function useToolbarContext() {
  const context = React.useContext(ToolbarContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Toolbar subcomponents must be placed within a <Toolbar /> component.',
    );
  }

  return context;
}
