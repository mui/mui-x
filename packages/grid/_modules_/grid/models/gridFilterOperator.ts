import * as React from 'react';
import { AutocompleteProps } from '@mui/material/Autocomplete';
import { GridFilterInputValueProps } from '../components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterInputMultipleValueProps } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';
import type { GridStateColDef } from './colDef';

export interface GridFilterOperator {
  label?: string;
  value: string;
  isArrayValue?: boolean;
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: GridStateColDef,
  ) => null | ((params: GridCellParams) => boolean);
  InputComponent?:
    | React.JSXElementConstructor<GridFilterInputValueProps>
    | React.JSXElementConstructor<
        GridFilterInputMultipleValueProps &
          Omit<AutocompleteProps<any[], true, false, true>, 'options' | 'renderInput'>
      >;
  InputComponentProps?: Record<string, any>;
}
