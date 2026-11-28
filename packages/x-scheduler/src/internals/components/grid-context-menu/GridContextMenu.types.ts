import type * as React from 'react';
import type { GridContextMenuAnchorPosition } from '@mui/x-scheduler-internals/internals';

export interface GridContextMenuProviderProps {
  children: React.ReactNode;
}

export interface GridContextMenuProps {
  open: boolean;
  anchorPosition: GridContextMenuAnchorPosition;
  /**
   * Starts the event creation flow at the right-clicked date (and resource).
   * The "New event" item is not rendered when it is not provided.
   */
  createEvent?: (event?: Event) => void;
  onClose: () => void;
}
