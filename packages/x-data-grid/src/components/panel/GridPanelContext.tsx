import * as React from 'react';

export interface GridPanelContextValue {
  columnsPanelTriggerRef: React.RefObject<HTMLButtonElement | null>;
  filterPanelTriggerRef: React.RefObject<HTMLButtonElement | null>;
  aiAssistantPanelTriggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const GridPanelContext = React.createContext<GridPanelContextValue | undefined>(undefined);

export function useGridPanelContext() {
  const context = React.useContext(GridPanelContext);

  if (context === undefined) {
    throw new Error('MUI X: Missing context.');
  }

  return context;
}

export function GridPanelContextProvider({ children }: { children: React.ReactNode }) {
  const columnsPanelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const filterPanelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const aiAssistantPanelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const value = React.useMemo(
    () => ({ columnsPanelTriggerRef, filterPanelTriggerRef, aiAssistantPanelTriggerRef }),
    [],
  );
  return <GridPanelContext.Provider value={value}>{children}</GridPanelContext.Provider>;
}
