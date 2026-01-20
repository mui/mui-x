import * as React from 'react';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-headless-premium/use-event-occurrences-with-timeline-position';

export interface TimelineEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: useEventOccurrencesWithTimelinePosition.EventRenderableOccurrenceWithPosition;
  /**
   * The variant of the event, which determines its styling.
   */
  variant: 'regular' | 'placeholder';
  /**
   * ID of the header this event is associated with (for aria-labelledby).
   */
  ariaLabelledBy: string;
}
