import { type StyleSlot } from '@mui/x-internals/css';
import { composeGridStyles } from '../../utils/composeGridStyles';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export function useGridSlot<S extends StyleSlot<any, any, any>>(
  rootProps: DataGridProcessedProps,
  slot: S,
): S {
  const config = useGridConfiguration();
  const currentSlot = config.styleSlots[slot.meta.slot] as S;
  const classes = composeGridStyles(currentSlot.classes, rootProps.classes);
  if (classes !== currentSlot.classes) {
    return { ...currentSlot, classes };
  }
  return currentSlot;
}
