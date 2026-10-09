'use client';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import getActiveElement from '@mui/utils/getActiveElement';
import { useEventEditingStyledContext } from '../event-editing';
import { useEventContextMenuItems } from './EventContextMenuItems';
import type { EventContextMenuProps } from './EventContextMenu.types';

/**
 * The menu shown on right-click of an event, or on pressing `Space` while it is focused. Thin
 * presentational wrapper around `@mui/material/Menu` — all the actual logic lives in
 * `useEventContextMenuItems`.
 */
export function EventContextMenu(props: EventContextMenuProps) {
  const {
    open,
    occurrence,
    anchorEl,
    anchorPosition,
    onEditingCanceled,
    stableAnchor,
    focusFallback,
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

  // The menu restores focus to its anchor, which is gone when the anchor unmounted.
  const handleExited = (paper: HTMLElement) => {
    const activeElement = getActiveElement(paper.ownerDocument);
    const focusIsAboutToBeLost =
      activeElement === null ||
      activeElement === paper.ownerDocument.body ||
      paper.contains(activeElement);
    if (focusIsAboutToBeLost && !anchorEl.isConnected) {
      focusFallback?.focus({ preventScroll: true });
    }
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
