import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { CalendarEvent } from '../../../../primitives/models';

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
   * Handles the close action of the popover.
   */
  onClose: () => void;
}

export interface EventPopoverContextValue {
  startEditing: (event: React.MouseEvent, calendarEvent: CalendarEvent) => void;
}

export interface EventPopoverProviderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export interface EventPopoverTriggerProps extends Popover.Trigger.Props {
  event: CalendarEvent;
}
