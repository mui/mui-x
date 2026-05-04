import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';

export interface MoreEventsPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /**
   * The day whose occurrences are listed.
   */
  day: SchedulerProcessedDate;
  /**
   * The anchor element for the popover positioning.
   */
  anchor: HTMLElement;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
}

export interface MoreEventsPopoverProviderProps {
  children: React.ReactNode;
}
