'use client';
import * as React from 'react';
import type { EventDialogClasses } from '../event-dialog/eventDialogClasses';
import type { EventEditingLocaleText } from '../../../models/translations';

export interface EventEditingStyledContextValue {
  schedulerId: string | undefined;
  classes: EventDialogClasses;
  localeText: EventEditingLocaleText;
}

export const EventEditingStyledContext = React.createContext<EventEditingStyledContextValue | null>(
  null,
);

export function useEventEditingStyledContext(): EventEditingStyledContextValue {
  const value = React.useContext(EventEditingStyledContext);
  if (!value) {
    throw new Error(
      'MUI X Scheduler: useEventEditingStyledContext must be used within an EventEditingStyledContext.Provider. ' +
        'The component requires access to the editing surface styling and locale information. ' +
        'Ensure the component is rendered inside an EventCalendar (or premium) provider.',
    );
  }
  return value;
}
