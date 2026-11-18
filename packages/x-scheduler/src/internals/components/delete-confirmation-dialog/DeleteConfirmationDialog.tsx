'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingStyledContext } from '../event-editing';

/** Set by a surface that already mounts the dialog for its subtree, so nested ones skip it. */
export const DeleteConfirmationDialogHostContext = React.createContext(false);

function DeleteConfirmationDialogContent() {
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
      aria-describedby={`${schedulerId}-delete-confirmation-dialog-description`}
    >
      <DialogTitle id={`${schedulerId}-delete-confirmation-dialog-title`}>
        {localeText.deleteConfirmationTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={`${schedulerId}-delete-confirmation-dialog-description`}>
          {localeText.deleteConfirmationMessage}
        </DialogContentText>
      </DialogContent>
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

/** Asks for confirmation before deleting an event that has no recurring scope to choose. */
export function DeleteConfirmationDialog() {
  const isHosted = React.useContext(DeleteConfirmationDialogHostContext);

  return isHosted ? null : <DeleteConfirmationDialogContent />;
}
