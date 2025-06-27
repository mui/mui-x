import * as React from 'react';
import { CalendarEvent } from '../models/events';
import { CalendarResource } from '../models/resource';

export interface EventPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event info to display in the popover.
   */
  calendarEvent: CalendarEvent;
  /**
   * The resource the event is associated with.
   */
  calendarEventResource: CalendarResource | undefined;
  /**
   * The anchor element for the popover positioning.
   */
  anchor: HTMLElement;
  /**
   * The container element for the popover portal.
   */
  container: HTMLElement | null;
  /**
   * Callback fired when an event is edited.
   * @param {CalendarEvent} event The updated event.
   */
  onEventEdit: (event: CalendarEvent) => void;
  /**
   * Callback fired when an event is deleted.
   * @param {string} id The deleted event id.
   */
  onEventDelete: (id: string) => void;
  /**
   * Handles the close action of the popover.
   */
  onClose: () => void;
}
