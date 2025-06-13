import * as React from 'react';
import { CalendarEvent } from '../models/events';

export interface EventPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event info to display in the popover.
   */
  calendarEvent: CalendarEvent;
  /**
   * The anchor element for the popover positioning.
   */
  anchor: HTMLElement;
  /**
   * The container element for the popover portal.
   */
  container: HTMLElement | null;
  /**
   * Callback fired when an action is performed on the event (edit or delete).
   * @param {CalendarEvent} event  The updated or deleted event.
   * @param {'edit' | 'delete'} action The action performed: 'edit' or 'delete'.
   */
  onEventAction: (event: CalendarEvent, action: 'edit' | 'delete') => void;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
}
