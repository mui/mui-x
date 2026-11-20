'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import type { PickerLayoutOwnerState } from './PickersLayout.types';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

/**
 * Gives the layout owner state to the action bar.
 * A prop would break the action bar memoization.
 */
export const PickerLayoutOwnerStateContext = React.createContext<PickerLayoutOwnerState | null>(
  null,
);

/**
 * Returns the layout owner state with `hasShortcuts` and `hasToolbar` set to `false`.
 * Only `usePickerLayout` knows their real values.
 */
export function usePickerLayoutOwnerState() {
  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const isRtl = useRtl();

  return React.useMemo<PickerLayoutOwnerState>(
    () => ({
      ...pickerOwnerState,
      layoutDirection: isRtl ? 'rtl' : 'ltr',
      hasShortcuts: false,
      hasToolbar: false,
    }),
    [pickerOwnerState, isRtl],
  );
}
