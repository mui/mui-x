'use client';
import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { ControlledValue } from '../event-dialog/utils';

export interface RecurrenceTabRendererProps {
  occurrence: SchedulerRenderableEventOccurrence;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
  tabValue: string;
}

/**
 * Components optionally rendered inside the editing surface. Premium fills these via
 * `optionalRenderers`; community leaves them empty.
 */
export interface EventEditingOptionalRenderers {
  /**
   * Component rendered as the "Recurrence" tab inside the editing form.
   */
  recurrenceTab?: React.ComponentType<RecurrenceTabRendererProps>;
  /**
   * Prompt to choose the scope of a recurring update. Stacks on the active surface with its own shell.
   */
  recurringScopeDialog?: React.ComponentType<Record<string, never>>;
}

export const EventEditingOptionalRenderersContext =
  React.createContext<EventEditingOptionalRenderers>({});

export function useEventEditingOptionalRenderers(): EventEditingOptionalRenderers {
  return React.useContext(EventEditingOptionalRenderersContext);
}
