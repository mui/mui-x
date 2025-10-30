import * as React from 'react';
import { CalendarEventOccurrenceWithTimePosition } from '@mui/x-scheduler-headless/models';

export interface TimelineEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: CalendarEventOccurrenceWithTimePosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular';
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
