import * as React from 'react';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-timeline-position';

export interface TimeGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: useEventOccurrencesWithTimelinePosition.EventRenderableOccurrenceWithPosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
}
