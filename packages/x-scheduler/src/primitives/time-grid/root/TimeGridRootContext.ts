import * as React from 'react';

export interface TimeGridRootContext {}

export const TimeGridRootContext = React.createContext<TimeGridRootContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  TimeGridRootContext.displayName = 'TimeGridRootContext';
}

export function useTimeGridRootContext() {
  const context = React.useContext(TimeGridRootContext);
  if (context === undefined) {
    throw new Error(
      'Time Box: TimeGridRootContext is missing. Event Time Grid parts must be placed within <TimeGrid.Root />.',
    );
  }
  return context;
}
