import * as React from 'react';

export const PickersFieldContext = React.createContext<PickersFieldContextValue | null>(null);

export function PickersFieldProvider(props: PickersFieldProviderProps) {
  const { value, children } = props;

  return <PickersFieldContext.Provider value={value}>{children}</PickersFieldContext.Provider>;
}

interface PickersFieldProviderProps {
  value: PickersFieldContextValue;
  children: React.ReactNode;
}

export interface PickersFieldContextValue {
  onOpen: (event: React.UIEvent) => void;
}
