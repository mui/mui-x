import * as React from 'react';
import { GridFilterInputValueProps } from '../components/panel/filterPanel/GridFilterInputValueProps';
import { GridFilterInputMultipleValueProps } from '../components/panel/filterPanel/GridFilterInputMultipleValue';
import { GridFilterInputMultipleSingleSelectProps } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';
import { GridFilterItem } from './gridFilterItem';
import { GridCellParams } from './params/gridCellParams';
import type { GridStateColDef } from './colDef/gridColDef';
import type { GridValidRowModel } from './gridRows';

/**
 * Filter operator definition interface.
 */
export interface GridFilterOperator<R extends GridValidRowModel = any, V = any, F = V> {
  /**
   * The label of the filter operator.
   */
  label?: string;
  /**
   * The name of the filter operator.
   * It will be matched with the `operatorValue` property of the filter items.
   */
  value: string;
  /**
   * The callback that generates a filtering function for a given filter item and column.
   * This function can return `null` to skip filtering for this item and column.
   * @param {GridFilterItem} filterItem The filter item with which we want to filter the column.
   * @param {GridStateColDef} column The column from which we want to filter the rows.
   * @returns {null | ((params: GridCellParams) => boolean)} The function to call to check if a row pass this filter item or not.
   */
  getApplyFilterFn: (
    filterItem: GridFilterItem,
    column: GridStateColDef<R, V, F>,
  ) => null | ((params: GridCellParams<V, R, F>) => boolean);
  /**
   * The input component to render in the filter panel for this filter operator.
   */
  InputComponent?:
    | React.JSXElementConstructor<GridFilterInputValueProps>
    | React.JSXElementConstructor<GridFilterInputMultipleValueProps>
    | React.JSXElementConstructor<GridFilterInputMultipleSingleSelectProps>;
  /**
   * The props to pass to the input component in the filter panel for this filter operator.
   */
  InputComponentProps?: Record<string, any>;
}
