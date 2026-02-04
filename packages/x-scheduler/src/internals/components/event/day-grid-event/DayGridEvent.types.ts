import * as React from 'react';
import type { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';

export interface DayGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: useEventOccurrencesWithDayGridPosition.EventRenderableOccurrenceWithPosition;
  /**
   * The variant of the event, which determines its styling.
   * 'filled': displays the event title only on a solid background.
   * 'compact': displays the resource legend, event title alongside the event time on a neutral background.
   * 'invisible': the event is visually hidden.
   * 'placeholder': displays the event title on a lighter background to indicate a placeholder event.
   */
  variant: 'filled' | 'compact' | 'invisible' | 'placeholder';
}
