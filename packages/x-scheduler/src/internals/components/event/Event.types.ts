import { SchedulerProcessedEvent } from '@mui/x-scheduler-headless/models';

export interface EventProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired when the event is clicked.
   */
  onEventClick?: (event: React.MouseEvent, processedEvent: SchedulerProcessedEvent) => void;
}
