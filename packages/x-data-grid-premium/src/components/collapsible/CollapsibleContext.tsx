import * as React from 'react';

export interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panelId: string | undefined;
}

export const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(
  undefined,
);

export function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Collapsible subcomponents must be placed within a <Collapsible /> component.',
    );
  }

  return context;
}
