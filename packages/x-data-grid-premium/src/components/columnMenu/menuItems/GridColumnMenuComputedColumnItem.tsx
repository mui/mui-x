import * as React from 'react';
import {
  GRID_TREE_DATA_GROUPING_FIELD,
  gridColumnFieldsSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import type { GridColumnMenuItemProps } from '@mui/x-data-grid-pro';
import { gridPivotActiveSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';
import { isGroupingColumn } from '../../../hooks/features/rowGrouping/gridRowGroupingUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

/**
 * The computed columns entries of the column menu: "Add computed column" on
 * every data column (the new column is inserted right after it), plus "Edit"
 * and "Remove" on a computed column. Only pushed into the menu by the computed
 * columns hook when the feature is available.
 */
export function GridColumnMenuComputedColumnItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);

  // Utility columns are no position anchor for a new column.
  const isUtilityColumn =
    colDef.type === 'actions' ||
    colDef.field === GRID_TREE_DATA_GROUPING_FIELD ||
    isGroupingColumn(colDef.field);

  if (pivotActive || isUtilityColumn) {
    return null;
  }

  const addComputedColumn = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.showComputedColumnEditor(null, {
      columnIndex: gridColumnFieldsSelector(apiRef).indexOf(colDef.field) + 1,
    });
  };

  const editComputedColumn = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.showComputedColumnEditor(colDef.field);
  };

  const removeComputedColumn = (event: React.MouseEvent<HTMLElement>) => {
    onClick(event);
    apiRef.current.removeComputedColumn(colDef.field);
  };

  return (
    <React.Fragment>
      {colDef.computed && (
        <React.Fragment>
          <rootProps.slots.baseMenuItem
            onClick={editComputedColumn}
            iconStart={<rootProps.slots.computedColumnIcon fontSize="small" />}
          >
            {apiRef.current.getLocaleText('columnMenuEditComputedColumn')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem
            onClick={removeComputedColumn}
            iconStart={<rootProps.slots.columnMenuClearIcon fontSize="small" />}
          >
            {apiRef.current.getLocaleText('columnMenuRemoveComputedColumn')}
          </rootProps.slots.baseMenuItem>
        </React.Fragment>
      )}
      <rootProps.slots.baseMenuItem
        onClick={addComputedColumn}
        iconStart={<rootProps.slots.computedColumnIcon fontSize="small" />}
      >
        {apiRef.current.getLocaleText('columnMenuAddComputedColumn')}
      </rootProps.slots.baseMenuItem>
    </React.Fragment>
  );
}
