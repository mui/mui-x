import * as React from 'react';
import { CalendarEvent } from '../models/events';

export interface EventPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event info to display in the popover.
   */
  calendarEvent: CalendarEvent | null;
  /**
   * The anchor element for the popover positioning.
   */
  anchor: HTMLElement | null;
  /**
   * The container element for the popover portal.
   */
  container: HTMLElement | null;
}
