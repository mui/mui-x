import { styled } from '@mui/material';
import { StyleSlot, STYLE_SLOT_REGISTRY } from '@mui/x-internals/css';
import { useGridAriaAttributes } from '../hooks/utils/useGridAriaAttributes';
import { useGridRowAriaAttributes } from '../hooks/features/rows/useGridRowAriaAttributes';
import { useMaterialCSSVariables } from '../material/variables';
import type { GridConfiguration } from '../models/configuration/gridConfiguration';

export const STYLE_SLOT_REGISTRY_MATERIAL = {} as Record<string, StyleSlot<any, any, any>>;

let didSetup = false;
export function setupMaterialStyleSlots() {
  if (didSetup) {
    return;
  }
  didSetup = true;

  for (const key in STYLE_SLOT_REGISTRY) {
    // eslint-disable-line guard-for-in
    const slot = STYLE_SLOT_REGISTRY[key] as StyleSlot<any, any, any>;
    const materialSlot = {
      ...slot,
      component: styled(slot.meta.as as any, slot.meta)(null) as any,
    };
    STYLE_SLOT_REGISTRY_MATERIAL[key] = materialSlot;
  }
}

export const configuration: GridConfiguration = {
  hooks: {
    useCSSVariables: useMaterialCSSVariables,
    useGridAriaAttributes,
    useGridRowAriaAttributes,
    useCellAggregationResult: () => null,
  },
  styleSlots: STYLE_SLOT_REGISTRY_MATERIAL,
};
