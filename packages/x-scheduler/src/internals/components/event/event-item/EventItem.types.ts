import type * as React from 'react';
import type { Button } from '@base-ui/react/button';
import type { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import type { BaseTemporal } from '@mui/x-scheduler-internals/internals';

export interface EventItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  onClick?: Button.Props['onClick'];
  /**
   * The event occurrence to render.
   */
  occurrence: SchedulerEventOccurrence;
  /**
   * The day the event occurrence is displayed in, read in the display timezone.
   */
  date: BaseTemporal.PlainDate;
  /**
   * The event variant.
   * 'regular' does not make the styling distinction between all day events and timed events, expect for the time display.
   * 'filled': displays the event title only on a solid background.
   * 'compact': displays the resource legend, event title alongside the event time on a neutral background.
   */
  variant: 'filled' | 'compact' | 'regular';
}
