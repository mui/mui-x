import { EventTimelinePremiumParameters } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { EventTimelineClasses } from './eventTimelineClasses';

// TODO: Add translations
export interface EventTimelinePremiumProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>,
    EventTimelinePremiumParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventTimelineClasses>;
}
