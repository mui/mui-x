'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingContext, useEventEditingStyledContext } from '../event-editing';

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
 * The nearest surviving focusable ancestor of an event about to be removed from the DOM — the
 * grid column/cell it lives in, which (unlike the event itself) doesn't unmount on delete.
 *
 * An immediate delete removes `anchorEl` from the DOM in the same commit that closes the menu.
 * MUI's `Menu` tries to restore focus to the element that had it when the menu opened (`anchorEl`
 * itself here), but since that node is now detached, the restore silently fails and focus is lost
 * to `<body>`. Falling back to this ancestor keeps a keyboard user's place in the grid.
 */
function getFocusFallback(anchorEl: HTMLElement): HTMLElement | null {
  return anchorEl.parentElement?.closest<HTMLElement>('[tabindex]') ?? null;
}

/**
 * Builds the Edit / Delete menu items for `EventContextMenu`. Both actions go through the exact
 * same store calls as `EventEditingTrigger`'s click and `EventToolbar`/`FormContent`'s delete, so
 * behavior (dialog positioning, the recurring scope dialog) matches those flows exactly.
 */
export function useEventContextMenuItems(
  params: UseEventContextMenuItemsParameters,
): React.ReactNode[] {
  const { occurrence, anchorEl, onRequestClose, onEditingCanceled, stableAnchor } = params;

  const store = useSchedulerStoreContext();
  const { classes, localeText } = useEventEditingStyledContext();
  const { startEditing } = useEventEditingContext();

  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);
  const areRecurringEventsAvailable = useStore(
    store,
    schedulerOtherSelectors.areRecurringEventsAvailable,
  );

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

  // Mirrors EventToolbar's delete / FormContent's delete: recurring events open the scope dialog;
  // single events delete immediately. No confirmation step here either — see #18025.
  const handleDelete = () => {
    onRequestClose();
    if (areRecurringEventsAvailable && recurringEventsPlugin && occurrence.displayTimezone.rrule) {
      store.deleteRecurringEvent({
        occurrenceStart: occurrence.displayTimezone.start.value,
        eventId: occurrence.id,
        onSubmit: () => {},
      });
      return;
    }

    // Captured before the delete unmounts `anchorEl` — see `getFocusFallback`.
    const focusFallback = getFocusFallback(anchorEl);
    store.deleteEvent(occurrence.id);
    focusFallback?.focus();
  };

  return [
    <MenuItem className={classes.eventContextMenuEditItem} key="edit" onClick={handleEdit}>
      <ListItemIcon>
        <EditRounded fontSize="small" />
      </ListItemIcon>
      <ListItemText>{localeText.editEvent}</ListItemText>
    </MenuItem>,
    <MenuItem className={classes.eventContextMenuDeleteItem} key="delete" onClick={handleDelete}>
      <ListItemIcon>
        <DeleteRounded fontSize="small" />
      </ListItemIcon>
      <ListItemText>{localeText.deleteEvent}</ListItemText>
    </MenuItem>,
  ];
}
