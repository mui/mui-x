import * as React from 'react';

export interface SidePanelDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the drawer is open.
   */
  open: boolean;
  /**
   * Called when the drawer requests to be closed (close button, Escape key, or backdrop).
   */
  onClose: () => void;
  /**
   * The element the drawer portals into. Pointing it at the calendar root keeps the
   * drawer scoped to the root container query and positioned relative to the calendar.
   */
  container?: React.RefObject<HTMLElement | null>;
}
