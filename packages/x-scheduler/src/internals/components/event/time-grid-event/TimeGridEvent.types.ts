import type * as React from 'react';
import type { TimelineAxis } from '@mui/x-scheduler-internals/internals';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';

export interface TimeGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: useEventOccurrencesWithTimelinePosition.EventRenderableOccurrenceWithPosition;
  /**
   * The displayed window of the column the event is rendered in.
   */
  column: TimelineAxis;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
}
