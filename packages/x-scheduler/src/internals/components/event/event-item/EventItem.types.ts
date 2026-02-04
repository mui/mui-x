import * as React from 'react';
import { SchedulerEventOccurrence, SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';

export interface EventItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: SchedulerEventOccurrence;
  /**
   * The date the event occurrence is displayed in.
   */
  date: SchedulerProcessedDate;
  /**
   * The event variant.
   * 'regular' does not make the styling distinction between all day events and timed events, expect for the time display.
   * 'filled': displays the event title only on a solid background.
   * 'compact': displays the resource legend, event title alongside the event time on a neutral background.
   */
  variant: 'filled' | 'compact' | 'regular';
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
