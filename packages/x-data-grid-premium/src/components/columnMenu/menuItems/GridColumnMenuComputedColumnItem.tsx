import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GRID_TREE_DATA_GROUPING_FIELD,
  gridColumnFieldsSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import type { GridColumnMenuItemProps } from '@mui/x-data-grid-pro';
import { gridPivotActiveSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';
import { gridComputedColumnsSelector } from '../../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import { isComputedColumnEditable } from '../../../hooks/features/computedColumns/gridComputedColumnsUtils';
import { isGroupingColumn } from '../../../hooks/features/rowGrouping/gridRowGroupingUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../../hooks/utils/useGridPrivateApiContext';

/**
 * The computed columns entries of the column menu: "Add computed column" on
 * every data column (the new column is inserted right after it), plus "Edit"
 * and "Remove" on a computed column — "View" alone when its definition sets
 * `editable: false`. Only pushed into the menu by the computed columns hook when
 * the feature is available.
 */
function GridColumnMenuComputedColumnItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const model = useGridSelector(apiRef, gridComputedColumnsSelector);
  const definition = colDef.computed
    ? model.find((item) => item.field === colDef.field)
    : undefined;
  const editable = definition === undefined || isComputedColumnEditable(definition);

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
    apiRef.current.applyUserComputedColumnsChange(() =>
      apiRef.current.removeComputedColumn(colDef.field),
    );
  };

  return (
    <React.Fragment>
      {colDef.computed && (
        <React.Fragment>
          <rootProps.slots.baseMenuItem
            onClick={editComputedColumn}
            iconStart={<rootProps.slots.computedColumnIcon fontSize="small" />}
          >
            {apiRef.current.getLocaleText(
              editable ? 'columnMenuEditComputedColumn' : 'columnMenuViewComputedColumn',
            )}
          </rootProps.slots.baseMenuItem>
          {editable && (
            <rootProps.slots.baseMenuItem
              onClick={removeComputedColumn}
              iconStart={<rootProps.slots.columnMenuClearIcon fontSize="small" />}
            >
              {apiRef.current.getLocaleText('columnMenuRemoveComputedColumn')}
            </rootProps.slots.baseMenuItem>
          )}
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

GridColumnMenuComputedColumnItem.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuComputedColumnItem };
