'use client';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddRounded from '@mui/icons-material/AddRounded';
import { useEventEditingStyledContext } from '../event-editing';

interface UseGridContextMenuItemsParameters {
  /**
   * Starts the event creation flow, see `GridContextMenuProps`.
   */
  createEvent?: (event?: Event) => void;
  onRequestClose: () => void;
}

/**
 * Builds the menu items for `GridContextMenu`. The actions come from the headless
 * `useEventCreationContextMenu`, which only opens the menu when at least one of them is available.
 */
export function useGridContextMenuItems(
  params: UseGridContextMenuItemsParameters,
): React.ReactNode[] {
  const { createEvent, onRequestClose } = params;
  const { classes, localeText } = useEventEditingStyledContext();

  const items: React.ReactNode[] = [];

  if (createEvent) {
    items.push(
      <MenuItem
        className={classes.gridContextMenuNewEventItem}
        key="new-event"
        onClick={(event) => {
          onRequestClose();
          createEvent(event.nativeEvent);
        }}
      >
        <ListItemIcon>
          <AddRounded fontSize="small" />
        </ListItemIcon>
        <ListItemText>{localeText.newEvent}</ListItemText>
      </MenuItem>,
    );
  }

  return items;
}
