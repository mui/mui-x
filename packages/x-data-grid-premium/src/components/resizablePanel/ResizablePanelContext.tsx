import * as React from 'react';

export interface ResizablePanelContextValue {
  rootRef: React.RefObject<HTMLDivElement | null>;
  direction: 'horizontal' | 'vertical';
}

export const ResizablePanelContext = React.createContext<ResizablePanelContextValue | undefined>(
  undefined,
);

export function useResizablePanelContext() {
  const context = React.useContext(ResizablePanelContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. ResizablePanel subcomponents must be placed within a <ResizablePanel /> component.',
    );
  }

  return context;
}
