import * as React from 'react';
import { CalendarEventOccurrenceWithTimePosition } from '@mui/x-scheduler-headless/models';

export interface TimeGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithTimePosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
}
