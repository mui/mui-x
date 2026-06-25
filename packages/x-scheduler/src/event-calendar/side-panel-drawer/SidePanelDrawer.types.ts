import * as React from 'react';

export interface SidePanelDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the drawer is open.
   */
  open: boolean;
  /**
   * Called when the drawer requests to be closed (close button, Escape key, backdrop, or swipe).
   */
  onClose: () => void;
  /**
   * The element the drawer portals into. Pointing it at the calendar root keeps
   * the drawer inside the root container query (so it stays scoped to the
   * calendar's width) and positioned relative to the calendar instead of the
   * viewport.
   */
  container?: React.RefObject<HTMLElement | null>;
}
