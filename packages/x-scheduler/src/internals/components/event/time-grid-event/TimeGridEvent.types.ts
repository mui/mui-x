import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';

export interface TimeGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * 1-based first lane (CSS column inside the day's time column) the event occupies.
   */
  firstLane: number;
  /**
   * 1-based last lane the event occupies (>= firstLane).
   */
  lastLane: number;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
}
