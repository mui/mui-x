import { OverridableStringUnion } from '@mui/types';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

export type GridColumnMenuSlot = 'filter' | 'sorting' | 'hideColumn' | 'manageColumns';
export interface GridColumnMenuSlotOverrides {}

export interface GridColumnMenuLookup {
  /**
   * Will be used to filter or override a specific item in `columnMenu`
   */
  slot: OverridableStringUnion<GridColumnMenuSlot, GridColumnMenuSlotOverrides>;
  component: React.ReactNode;
  displayName?: string;
  addDivider?: boolean;
}

export interface GridColumnMenuValue extends Array<GridColumnMenuLookup> {}
