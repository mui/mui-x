import * as React from 'react';

export interface TabsContextValue {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export function useTabsContext() {
  const context = React.useContext(TabsContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Tabs subcomponents must be placed within a <Tabs /> component.',
    );
  }

  return context;
}
