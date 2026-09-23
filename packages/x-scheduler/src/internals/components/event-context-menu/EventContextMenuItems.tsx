'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';
import { getFocusFallback } from '../../utils/focus-utils';

interface UseEventContextMenuItemsParameters {
  occurrence: SchedulerRenderableEventOccurrence;
  anchorEl: HTMLElement;
  onRequestClose: () => void;
  /** Forwarded to `startEditing` for Edit — see `EventEditingTriggerProps`. */
  onEditingCanceled?: () => void;
  /** Forwarded to `startEditing` for Edit — see `EventEditingTriggerProps`. */
  stableAnchor?: HTMLElement | null;
}

/**
 * Builds the menu items for `EventContextMenu`. Every action goes through the exact same store
 * calls as `EventEditingTrigger`'s click and `EventToolbar`/`FormContent`'s delete, so behavior
 * (dialog positioning, the recurring scope dialog) matches those flows exactly.
 *
 * A read-only event mirrors every other surface's mutation gate (the dialog swaps to
 * `ReadonlyContent`, and `getInitialEditingMode` never arms the toolbar for one): the menu still
 * opens, but "Edit event" becomes "Show details" — `startEditing` already resolves to the
 * read-only view, the label just has to say so — and Delete is dropped entirely.
 */
export function useEventContextMenuItems(
  params: UseEventContextMenuItemsParameters,
): React.ReactNode[] {
  const { occurrence, anchorEl, onRequestClose, onEditingCanceled, stableAnchor } = params;

  const store = useSchedulerStoreContext();
  const { classes, localeText } = useEventEditingStyledContext();
  const { startEditing } = useEventEditingContext();

  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, occurrence.id);

  const handleEdit = (event: React.MouseEvent) => {
    onRequestClose();
    const started = startEditing(
      { current: anchorEl },
      occurrence,
      event.nativeEvent,
      stableAnchor,
    );
    if (!started) {
      onEditingCanceled?.();
    }
  };

  // Recurring events open the scope dialog; non-recurring events go through the delete
  // confirmation dialog (unless `eventDeletion={{ confirmation: false }}`). Either way, focus is
  // only restored once the deletion actually applies — see `getFocusFallback`.
  const handleDelete = () => {
    onRequestClose();
    // Captured before the delete unmounts `anchorEl` — see `getFocusFallback`.
    const focusFallback = getFocusFallback(anchorEl);
    store.deleteOccurrence(occurrence, () => {
      // `onDelete` may fire synchronously (an immediate delete) or later, from the scope dialog's
      // or the confirmation dialog's own click handler — while its focus trap is still mounted.
      // An immediate `.focus()` call there gets pulled straight back into the trap. Deferring past
      // the current task lets the dialog actually close first, so the fallback focus sticks.
      setTimeout(() => focusFallback?.focus());
    });
  };

  const EditIcon = isReadOnly ? SearchRounded : EditRounded;
  const items: React.ReactNode[] = [
    <MenuItem
      className={
        isReadOnly ? classes.eventContextMenuShowDetailsItem : classes.eventContextMenuEditItem
      }
      key={isReadOnly ? 'show-details' : 'edit'}
      onClick={handleEdit}
    >
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{isReadOnly ? localeText.showEventDetails : localeText.editEvent}</ListItemText>
    </MenuItem>,
  ];

  if (!isReadOnly) {
    items.push(
      <MenuItem className={classes.eventContextMenuDeleteItem} key="delete" onClick={handleDelete}>
        <ListItemIcon>
          <DeleteRounded fontSize="small" />
        </ListItemIcon>
        <ListItemText>{localeText.deleteEvent}</ListItemText>
      </MenuItem>,
    );
  }

  return items;
}
