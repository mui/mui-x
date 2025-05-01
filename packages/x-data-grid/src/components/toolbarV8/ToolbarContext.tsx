import * as React from 'react';

export interface ToolbarContextValue {
  focusableItem: { id: string; index: number } | null;
  registerItem: (id: string, ref: React.RefObject<HTMLButtonElement | null>) => void;
  unregisterItem: (id: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onItemFocus: (id: string) => void;
  onItemDisabled: (id: string, disabled: boolean) => void;
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
