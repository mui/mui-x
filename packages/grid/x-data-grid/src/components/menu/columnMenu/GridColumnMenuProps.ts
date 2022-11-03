import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridColumnMenuLookup, GridColumnMenuValue } from '../../../hooks/features/columnMenu';

export interface GridColumnMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  hideMenu: (event: React.SyntheticEvent) => void;
  currentColumn: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
  defaultMenuItems: GridColumnMenuValue['items'];
  /**
   * To override existing and add new items in column menu
   * If the slot is already registered, it will be overwritten otherwise a new slot will be registered
   */
  columnMenuItems?: {
    [key in GridColumnMenuLookup['slot']]: Pick<GridColumnMenuLookup, 'component' | 'displayName'>;
  };
  getVisibleColumnMenuItems?: (
    items: Array<GridColumnMenuLookup['slot']>,
  ) => Array<GridColumnMenuLookup['slot']>;

  /**
   * Default column menu items in order that needs to be shown
   * Could be overriden by `getVisibleColumnMenuItems`
   */
  defaultVisibleSlots: Array<GridColumnMenuLookup['slot']>;
}
