import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';

export interface EventTimelinePremiumEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * 1-based first lane (CSS row inside the resource row) the event occupies.
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
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
