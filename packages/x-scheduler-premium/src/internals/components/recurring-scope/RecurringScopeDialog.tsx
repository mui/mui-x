'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Dialog from '@mui/material/Dialog';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingStyledContext } from '@mui/x-scheduler/internals';
import { RecurringScopeDialogProps } from './RecurringScopeDialog.types';
import { RecurringScopeContent } from './RecurringScopeContent';

/**
 * The desktop shell for the recurring scope confirmation: a centered dialog stacked on top of the
 * event dialog.
 */
export const RecurringScopeDialog = React.forwardRef<HTMLDivElement, RecurringScopeDialogProps>(
  function RecurringScopeDialog(props, ref) {
    // Context hooks
    const { schedulerId } = useEventEditingStyledContext();
    const store = useSchedulerStoreContext();

    // Selector hooks
    const open = useStore(store, schedulerOtherSelectors.isRecurringScopeOpen);

    return (
      <Dialog
        open={open}
        ref={ref}
        onClose={() => store.selectRecurringEventScope(null)}
        aria-labelledby={`${schedulerId}-scope-dialog-title`}
        {...props}
      >
        <RecurringScopeContent />
      </Dialog>
    );
  },
);
