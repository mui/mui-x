import { EventTimelinePremiumParameters } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { EventTimelinePremiumClasses } from './eventTimelinePremiumClasses';

// TODO: Add translations
export interface EventTimelinePremiumProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventTimelinePremiumParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventTimelinePremiumClasses>;
}
