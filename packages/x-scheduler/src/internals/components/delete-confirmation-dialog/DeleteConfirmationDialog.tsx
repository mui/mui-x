'use client';
import { useStore } from '@base-ui/utils/store';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingStyledContext } from '../event-editing';

/**
 * Asks for confirmation before deleting a non-recurring event.
 * Renders unconditionally, reading its own open state from the store.
 */
export function DeleteConfirmationDialog() {
  // Context hooks
  const { schedulerId, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const open = useStore(store, schedulerOtherSelectors.isDeleteConfirmationDialogOpen);

  return (
    <Dialog
      open={open}
      onClose={() => store.resolveEventDeletion(false)}
      aria-labelledby={`${schedulerId}-delete-confirmation-dialog-title`}
      // A confirmed deletion may remove the element that had focus before the dialog opened (the
      // toolbar/menu/dialog trigger), so restoring focus to it on close would silently fail and
      // fall back to `<body>`. Each caller's `onSubmit` already puts focus somewhere sensible.
      disableRestoreFocus
    >
      <DialogTitle id={`${schedulerId}-delete-confirmation-dialog-title`}>
        {localeText.deleteConfirmationTitle}
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => store.resolveEventDeletion(false)} type="button">
          {localeText.cancel}
        </Button>
        <Button
          onClick={() => store.resolveEventDeletion(true)}
          type="button"
          color="error"
          variant="contained"
        >
          {localeText.deleteEvent}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
