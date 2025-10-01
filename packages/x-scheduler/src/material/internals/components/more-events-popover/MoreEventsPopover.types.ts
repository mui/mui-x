import { CalendarEventOccurrence } from '../../../../primitives';

export interface MoreEventsPopoverContextValue {
  showEvents: (currentTarget: HTMLElement, occurrences: CalendarEventOccurrence[]) => void;
}
