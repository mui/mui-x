import type * as React from 'react';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import type { useEventOccurrencesWithTimelinePosition } from '@mui/x-scheduler-internals/use-event-occurrences-with-timeline-position';

export interface EventTimelinePremiumEventProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /**
   * The id of the resource row this event is rendered in.
   * Used to resolve the event's color against that row's resource instead of the event's
   * primary resource, so a multi-resource event can render a different color per row.
   */
  resourceId: SchedulerResourceId;
}
