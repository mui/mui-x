import * as React from 'react';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-headless/models';

export interface DayGridEventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to render.
   */
  occurrence: SchedulerRenderableEventOccurrence;
  /**
   * The 1-based lane index (CSS grid row inside the day cell) the event should render in.
   */
  firstLane: number;
  /**
   * Number of horizontal cells (days) the event spans.
   */
  cellSpan: number;
  /**
   * The variant of the event, which determines its styling.
   * 'filled': displays the event title only on a solid background.
   * 'compact': displays the resource legend, event title alongside the event time on a neutral background.
   * 'invisible': the event is visually hidden.
   * 'placeholder': displays the event title on a lighter background to indicate a placeholder event.
   */
  variant: 'filled' | 'compact' | 'invisible' | 'placeholder';
}
