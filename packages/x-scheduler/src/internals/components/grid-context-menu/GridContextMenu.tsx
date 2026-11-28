'use client';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import { useEventEditingStyledContext } from '../event-editing';
import { useGridContextMenuItems } from './GridContextMenuItems';
import type { GridContextMenuProps } from './GridContextMenu.types';

/**
 * The menu shown on right-click of the grid outside any event. Wraps `@mui/material/Menu`;
 * the opening logic lives in the headless `useEventCreationContextMenu`.
 */
export function GridContextMenu(props: GridContextMenuProps) {
  const { open, anchorPosition, createEvent, onClose } = props;

  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const items = useGridContextMenuItems({ createEvent, onRequestClose: onClose });

  return (
    <Menu
      className={classes.gridContextMenu}
      id={schedulerId ? `${schedulerId}-grid-context-menu` : undefined}
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      slotProps={{ list: { 'aria-label': localeText.gridContextMenuAriaLabel } }}
    >
      {items}
    </Menu>
  );
}
