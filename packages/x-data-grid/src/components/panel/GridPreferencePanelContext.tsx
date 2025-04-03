import * as React from 'react';

export interface GridPreferencePanelContextValue {
  columnsPanelTriggerRef: React.RefObject<HTMLButtonElement | null>;
  filterPanelTriggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const GridPreferencePanelContext = React.createContext<
  GridPreferencePanelContextValue | undefined
>(undefined);

export function useGridPreferencePanelContext() {
  const context = React.useContext(GridPreferencePanelContext);

  if (context === undefined) {
    throw new Error('MUI X: Missing context.');
  }

  return context;
}

export function GridPreferencePanelContextProvider({ children }: { children: React.ReactNode }) {
  const columnsPanelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const filterPanelTriggerRef = React.useRef<HTMLButtonElement>(null);
  const value = React.useMemo(() => ({ columnsPanelTriggerRef, filterPanelTriggerRef }), []);
  return (
    <GridPreferencePanelContext.Provider value={value}>
      {children}
    </GridPreferencePanelContext.Provider>
  );
}
