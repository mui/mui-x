import { TimelineParameters } from '@mui/x-scheduler-headless-premium/use-timeline';
import type { EventTimelineClasses } from './eventTimelineClasses';

// TODO: Add translations
export interface TimelineProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, TimelineParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventTimelineClasses>;
}
