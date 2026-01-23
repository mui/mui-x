import { EventTimelinePremiumParameters } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';

// TODO: Add translations
export interface EventTimelinePremiumProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventTimelinePremiumParameters<TEvent, TResource> {}
