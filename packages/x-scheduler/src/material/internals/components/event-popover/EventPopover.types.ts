import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { CalendarEventOccurrence } from '../../../../primitives/models';

export interface EventPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The event occurrence to display in the popover.
   */
  occurrence: CalendarEventOccurrence;
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
  startEditing: (currentTarget: HTMLElement, occurrence: CalendarEventOccurrence) => void;
}

export interface EventPopoverProviderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export interface EventPopoverTriggerProps extends Popover.Trigger.Props {
  occurrence: CalendarEventOccurrence;
}
