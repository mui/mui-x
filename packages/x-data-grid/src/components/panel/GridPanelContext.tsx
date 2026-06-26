'use client';
import * as React from 'react';

export interface GridPanelTrigger {
  setRef: (instance: HTMLElement | null) => void;
  element: HTMLElement | null;
}

export interface GridPanelContextValue {
  triggers: {
    filterPanel: GridPanelTrigger;
    aiAssistantPanel: GridPanelTrigger;
    columnsPanel: GridPanelTrigger;
  };
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
  const [triggerElements, setTriggerElements] = React.useState<{
    columnsPanel: HTMLElement | null;
    filterPanel: HTMLElement | null;
    aiAssistantPanel: HTMLElement | null;
  }>({
    columnsPanel: null,
    filterPanel: null,
    aiAssistantPanel: null,
  });

  const updateTriggerElement = React.useCallback(
    (key: keyof typeof triggerElements, instance: HTMLElement | null) => {
      setTriggerElements((prev) => {
        if (prev[key] === instance) {
          return prev;
        }

        return { ...prev, [key]: instance };
      });
    },
    [],
  );

  const setColumnsPanelTrigger = React.useCallback<GridPanelTrigger['setRef']>(
    (instance) => {
      updateTriggerElement('columnsPanel', instance);
    },
    [updateTriggerElement],
  );

  const setFilterPanelTrigger = React.useCallback<GridPanelTrigger['setRef']>(
    (instance) => {
      updateTriggerElement('filterPanel', instance);
    },
    [updateTriggerElement],
  );

  const setAiAssistantPanelTrigger = React.useCallback<GridPanelTrigger['setRef']>(
    (instance) => {
      updateTriggerElement('aiAssistantPanel', instance);
    },
    [updateTriggerElement],
  );

  const value = React.useMemo<GridPanelContextValue>(
    () => ({
      triggers: {
        columnsPanel: {
          element: triggerElements.columnsPanel,
          setRef: setColumnsPanelTrigger,
        },
        filterPanel: {
          element: triggerElements.filterPanel,
          setRef: setFilterPanelTrigger,
        },
        aiAssistantPanel: {
          element: triggerElements.aiAssistantPanel,
          setRef: setAiAssistantPanelTrigger,
        },
      },
    }),
    [triggerElements, setColumnsPanelTrigger, setFilterPanelTrigger, setAiAssistantPanelTrigger],
  );

  return <GridPanelContext.Provider value={value}>{children}</GridPanelContext.Provider>;
}
