import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import {
  GridColumnMenuLookup,
  GridColumnMenuValue,
  GridColumnMenuSlot,
} from '../../../hooks/features/columnMenu';

export interface GridColumnMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  hideMenu: (event: React.SyntheticEvent) => void;
  currentColumn: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
  menuItems: GridColumnMenuValue;
  filterColumnMenuItems?: (
    items: Array<GridColumnMenuLookup['slot']>,
  ) => Array<GridColumnMenuLookup['slot']>;
  /**
   * To override existing and add new items in column menu
   * If the slot is already registered, it will be overwritten otherwise a new slot will be registered
   */
  columnMenuItems?: {
    [key in GridColumnMenuSlot]: Pick<
      GridColumnMenuLookup,
      'component' | 'displayName' | 'addDivider'
    >;
  };
}
