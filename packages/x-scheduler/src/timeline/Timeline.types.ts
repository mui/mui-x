import { TimelineParameters } from '@mui/x-scheduler-headless/use-timeline';

// TODO: Add translations
export interface TimelineProps<EventModel extends {}>
  extends React.HTMLAttributes<HTMLDivElement>,
    TimelineParameters<EventModel> {}
