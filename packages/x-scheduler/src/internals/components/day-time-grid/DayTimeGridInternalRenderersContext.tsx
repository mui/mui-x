'use client';
import * as React from 'react';
import { TimeGridEventComponent } from '../event/time-grid-event/TimeGridEvent.types';

/**
 * Components internally overridable inside `DayTimeGrid`. The desktop renderer is always
 * provided as a default; sibling views in `@mui/x-scheduler` (e.g. `CompactDayTimeGrid`)
 * wrap `DayTimeGrid` with this provider to swap in a different variant.
 */
export interface DayTimeGridInternalRenderers {
  /**
   * Component used to render each event in the time-grid area.
   */
  timeGridEvent?: TimeGridEventComponent;
}

export const DayTimeGridInternalRenderersContext =
  React.createContext<DayTimeGridInternalRenderers>({});

export function useDayTimeGridInternalRenderers(): DayTimeGridInternalRenderers {
  return React.useContext(DayTimeGridInternalRenderersContext);
}
