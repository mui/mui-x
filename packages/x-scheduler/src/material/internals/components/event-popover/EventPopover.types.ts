import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { CalendarEvent, CalendarResource } from '../../../../primitives/models';

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
   * The container element for the popover portal.
   */
  container: HTMLElement | null;
  /**
   * Closes the popover.
   */
  onClose: () => void;
}

export interface EventPopoverProviderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export interface EventPopoverTriggerProps extends Popover.Trigger.Props {
  event: CalendarEvent;
}
