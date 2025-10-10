import { TimelineParameters } from '@mui/x-scheduler-headless/use-timeline';

// TODO: Add translations
export interface TimelineProps<TEvent extends {}, TResource extends {}>
  extends React.HTMLAttributes<HTMLDivElement>,
    TimelineParameters<TEvent, TResource> {}
