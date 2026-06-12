'use client';
import * as React from 'react';
import { TimeGridEventComponent } from '../event/time-grid-event/TimeGridEvent.types';
import { TimeGridEvent } from '../event/time-grid-event/TimeGridEvent';

/**
 * Components internally overridable inside `DayTimeGrid`. The context is seeded with the
 * desktop renderers as its default value, so consumers always receive a usable renderer
 * without wrapping `DayTimeGrid` in a provider. The compact views (`CompactDayView`,
 * `CompactThreeDayView`, `CompactWeekView`) wrap `DayTimeGrid` with this provider to swap
 * in the touch-optimized variant.
 */
export interface DayTimeGridInternalRenderers {
  /**
   * Component used to render each event in the time-grid area.
   */
  timeGridEvent: TimeGridEventComponent;
}

export const DayTimeGridInternalRenderersContext =
  React.createContext<DayTimeGridInternalRenderers>({ timeGridEvent: TimeGridEvent });

export function useDayTimeGridInternalRenderers(): DayTimeGridInternalRenderers {
  return React.useContext(DayTimeGridInternalRenderersContext);
}
