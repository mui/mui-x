'use client';
import * as React from 'react';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ControlledValue } from './utils';

export interface RecurrenceTabRendererProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  tabValue: string;
}

/**
 * Components optionally rendered inside `EventDialog`. The premium scheduler fills these
 * via the `optionalRenderers` prop on `EventDialogProvider`; community leaves them empty.
 */
export interface EventDialogOptionalRenderers {
  /**
   * Component rendered as the "Recurrence" tab inside the event dialog.
   */
  recurrenceTab?: React.ComponentType<RecurrenceTabRendererProps>;
  /**
   * Component rendered when the user is asked to choose the scope of a recurring update.
   */
  recurringScopeDialog?: React.ComponentType<Record<string, never>>;
}

export const EventDialogOptionalRenderersContext =
  React.createContext<EventDialogOptionalRenderers>({});

export function useEventDialogOptionalRenderers(): EventDialogOptionalRenderers {
  return React.useContext(EventDialogOptionalRenderersContext);
}
