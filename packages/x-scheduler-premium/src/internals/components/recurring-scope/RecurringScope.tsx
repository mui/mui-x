'use client';
import * as React from 'react';
import { useEditingSurface } from '@mui/x-scheduler/internals';
import { RecurringScopeDialog } from './RecurringScopeDialog';
import { RecurringScopeDrawer } from './RecurringScopeDrawer';

/**
 * Picks the recurring scope shell that matches the active editing surface: a centered dialog stacked
 * on the desktop event dialog, or a bottom-sheet drawer stacked on the compact editing drawer. This
 * is the single `recurringScope` renderer the premium scheduler supplies to `EventDialogProvider`.
 */
export function RecurringScope() {
  const surface = useEditingSurface();
  return surface === 'drawer' ? <RecurringScopeDrawer /> : <RecurringScopeDialog />;
}
