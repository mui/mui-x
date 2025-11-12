import * as React from 'react';
import type { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';

export interface DayGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: useEventOccurrencesWithDayGridPosition.EventOccurrenceWithPosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'compact' | 'allDay' | 'invisible' | 'placeholder';
}
