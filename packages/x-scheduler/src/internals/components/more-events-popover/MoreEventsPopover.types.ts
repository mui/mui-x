import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useEventOccurrencesWithDayGridPosition } from '@mui/x-scheduler-headless/use-event-occurrences-with-day-grid-position';

export interface MoreEventsPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /**
   * The event occurrence to display in the popover.
   */
  occurrences: SchedulerEventOccurrence[];
  /**
   * The total count of occurrences.
   */
  count: number;
  /**
   * The day data for the occurrences.
   */
  day: useEventOccurrencesWithDayGridPosition.DayData;
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
