import * as React from 'react';
import { CalendarEventOccurrenceWithDayGridPosition } from '@mui/x-scheduler-headless/models';

export interface DayGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithDayGridPosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'compact' | 'allDay' | 'invisible' | 'placeholder';
}
