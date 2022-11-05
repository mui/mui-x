import { OverridableStringUnion } from '@mui/types';
import React from 'react';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

// To be used by Pro and Premium packages for overriding
export interface GridColumnMenuKeysInternalOverrides {}

// To be used by users for overriding
export interface GridColumnMenuKeysOverrides {}

export interface GridColumnMenuTypes {
  key: OverridableStringUnion<
    OverridableStringUnion<
      'filter' | 'sorting' | 'hideColumn' | 'manageColumns' | 'divider',
      GridColumnMenuKeysInternalOverrides
    >,
    GridColumnMenuKeysOverrides
  >;
}

export interface GridColumnMenuValue {
  items: { [key in GridColumnMenuTypes['key']]: React.ReactNode };
  visibleItemKeys: Array<GridColumnMenuTypes['key']>;
}
