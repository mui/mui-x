'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingStyledContext } from '@mui/x-scheduler/internals';
import { RecurringScopeContent } from './RecurringScopeContent';

const RecurringScopeDrawerRoot = styled(Drawer, {
  name: 'MuiRecurringScopeDrawer',
  slot: 'Root',
})(({ theme }) => ({
  [`& .${drawerClasses.paper}`]: {
    borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
    borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
  },
}));

/**
 * The compact shell for the recurring scope confirmation: a bottom-sheet drawer stacked on top of
 * the compact editing drawer.
 */
export function RecurringScopeDrawer() {
  // Context hooks
  const { schedulerId } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const open = useStore(store, schedulerOtherSelectors.isRecurringScopeOpen);

  return (
    <RecurringScopeDrawerRoot
      anchor="bottom"
      open={open}
      onClose={() => store.selectRecurringEventScope(null)}
      aria-labelledby={`${schedulerId}-scope-dialog-title`}
    >
      <RecurringScopeContent />
    </RecurringScopeDrawerRoot>
  );
}
