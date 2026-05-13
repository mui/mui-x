'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ControlledValue } from './utils';

export interface RecurrenceTabSlotProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  value: string;
}

export interface EventDialogSlots {
  /**
   * Component rendered as the "Recurrence" tab inside the event dialog.
   * Supplied by the premium scheduler. When omitted, the tab is hidden.
   */
  recurrenceTab?: React.ComponentType<RecurrenceTabSlotProps>;
  /**
   * Component rendered when the user is asked to choose the scope of a recurring update.
   * Supplied by the premium scheduler. When omitted, the scope dialog is hidden.
   */
  recurringScopeDialog?: React.ComponentType<{}>;
}

export const EventDialogSlotsContext = React.createContext<EventDialogSlots>({});

export function useEventDialogSlots(): EventDialogSlots {
  return React.useContext(EventDialogSlotsContext);
}
