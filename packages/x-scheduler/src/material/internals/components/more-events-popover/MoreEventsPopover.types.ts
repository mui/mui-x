import { CalendarEventOccurrence } from '../../../../primitives';
import { useEventOccurrencesWithDayGridPosition } from '../../../../primitives/use-event-occurrences-with-day-grid-position';

export interface MoreEventsPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to display in the popover.
   */
  occurrences: CalendarEventOccurrence[];
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
   * The container element for the popover portal.
   */
  container: HTMLElement | null;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
}

export interface MoreEventsPopoverProviderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}
