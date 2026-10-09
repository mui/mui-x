'use client';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import { useEventEditingStyledContext } from '../event-editing';
import { isFocusLostWith } from '../../utils/focus-utils';
import { useEventContextMenuItems } from './EventContextMenuItems';
import type { EventContextMenuProps } from './EventContextMenu.types';

/**
 * The menu shown on right-click of an event, or on pressing `Space` while it is focused. Wraps
 * `@mui/material/Menu`; the item logic lives in `useEventContextMenuItems`.
 */
export function EventContextMenu(props: EventContextMenuProps) {
  const {
    open,
    occurrence,
    anchorEl,
    anchorPosition,
    onEditingCanceled,
    stableAnchor,
    getFocusFallback,
    onClose,
  } = props;

  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
  const items = useEventContextMenuItems({
    occurrence,
    anchorEl,
    onRequestClose: onClose,
    onEditingCanceled,
    stableAnchor,
  });

  // The menu restores focus to its anchor, which fails once the anchor has unmounted.
  const handleExited = (paper: HTMLElement) => {
    if (anchorEl.isConnected || !isFocusLostWith(paper)) {
      return;
    }
    getFocusFallback?.()?.focus({ preventScroll: true });
  };

  return (
    <Menu
      className={classes.eventContextMenu}
      id={schedulerId ? `${schedulerId}-event-context-menu` : undefined}
      open={open}
      onClose={onClose}
      anchorReference={anchorPosition ? 'anchorPosition' : 'anchorEl'}
      anchorPosition={anchorPosition ?? undefined}
      anchorEl={anchorPosition ? undefined : anchorEl}
      slotProps={{
        list: { 'aria-label': localeText.eventContextMenuAriaLabel },
        transition: { onExited: handleExited },
      }}
    >
      {items}
    </Menu>
  );
}
