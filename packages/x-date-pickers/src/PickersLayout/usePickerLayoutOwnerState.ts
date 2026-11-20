'use client';
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import type { PickerLayoutOwnerState } from './PickersLayout.types';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

/**
 * Returns the owner state that the layout passes to its slots.
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
