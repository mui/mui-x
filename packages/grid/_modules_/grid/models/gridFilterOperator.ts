import * as React from 'react';
import { GridFilterInputValueProps } from '../components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';
import type { GridStateColDef } from './colDef';

export type GridFilterCallback = (params: GridCellParams) => boolean;

export interface GridFilterOperator {
  label?: string;
  value: string;
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: GridStateColDef,
  ) => null | GridFilterCallback;
  InputComponent?: React.JSXElementConstructor<GridFilterInputValueProps>;
  InputComponentProps?: Record<string, any>;
}
