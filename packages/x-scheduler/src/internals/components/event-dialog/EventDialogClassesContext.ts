'use client';
import * as React from 'react';
import type { EventDialogClasses } from './eventDialogClasses';

export const EventDialogClassesContext = React.createContext<EventDialogClasses | null>(null);

export function useEventDialogClasses(): EventDialogClasses {
  const classes = React.useContext(EventDialogClassesContext);
  if (!classes) {
    throw new Error(
      'MUI X: useEventDialogClasses must be used within EventDialogClassesContext.Provider',
    );
  }
  return classes;
}
