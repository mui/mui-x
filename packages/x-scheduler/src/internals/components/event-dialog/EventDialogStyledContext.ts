'use client';
import * as React from 'react';
import type { EventDialogClasses } from './eventDialogClasses';
import type { EventDialogLocaleText } from '../../../models/translations';

export interface EventDialogStyledContextValue {
  classes: EventDialogClasses;
  localeText: EventDialogLocaleText;
}

export const EventDialogStyledContext = React.createContext<EventDialogStyledContextValue | null>(
  null,
);

export function useEventDialogStyledContext(): EventDialogStyledContextValue {
  const value = React.useContext(EventDialogStyledContext);
  if (!value) {
    throw new Error(
      'MUI X: useEventDialogStyledContext must be used within EventDialogStyledContext.Provider',
    );
  }
  return value;
}
