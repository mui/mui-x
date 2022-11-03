import { OverridableStringUnion } from '@mui/types';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

// To be used by Pro and Premium packages for overriding
export interface GridColumnMenuSlotInternalOverrides {}

// To be used by users for overriding
export interface GridColumnMenuSlotOverrides {}

export interface GridColumnMenuLookup {
  /**
   * Will be used to filter or override a specific item in `columnMenu`
   */
  slot: OverridableStringUnion<
    OverridableStringUnion<
      'filter' | 'sorting' | 'hideColumn' | 'manageColumns' | 'divider',
      GridColumnMenuSlotInternalOverrides
    >,
    GridColumnMenuSlotOverrides
  >;
  component: React.ReactNode;
  displayName?: string;
}

export interface GridColumnMenuValue {
  items: Array<GridColumnMenuLookup>;
  visibleSlots: Array<GridColumnMenuLookup['slot']>;
}
