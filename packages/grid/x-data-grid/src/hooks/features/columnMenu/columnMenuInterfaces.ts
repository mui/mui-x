import { OverridableStringUnion } from '@mui/types';
import React from 'react';
// TODO Fix cyclic deps
// eslint-disable-next-line import/no-cycle
import { GridColDef } from '../../../models/colDef/gridColDef';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

// To be used by Pro and Premium packages for overriding
export interface GridColumnMenuKeysInternalOverrides {}

// To be used by users for overriding
export interface GridColumnMenuKeysOverrides {}

export type GridColumnMenuKey = OverridableStringUnion<
  'filter' | 'sorting' | 'hideColumn' | 'manageColumns' | 'divider',
  GridColumnMenuKeysInternalOverrides & GridColumnMenuKeysOverrides
>;

export interface GridColumnMenuValue {
  items: { [key in GridColumnMenuKey]?: React.ReactElement };
  visibleItemKeys: Array<GridColumnMenuKey>;
}

export interface GetVisibleColumnMenuItemsArgs {
  visibleItemKeys: Array<GridColumnMenuKey>;
  itemKeys: Array<GridColumnMenuKey>;
  column: GridColDef;
}
