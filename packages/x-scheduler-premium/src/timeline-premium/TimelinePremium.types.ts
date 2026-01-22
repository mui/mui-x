import { TimelinePremiumParameters } from '@mui/x-scheduler-headless-premium/use-timeline-premium';

// TODO: Add translations
export interface TimelinePremiumProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, TimelinePremiumParameters<TEvent, TResource> {}
