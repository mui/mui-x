import * as React from 'react';
import PropTypes from 'prop-types';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridColDef } from '../../models/colDef/gridColDef';
import { isAutogeneratedRowNode } from '../../hooks/features/rows/gridRowsUtils';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['booleanCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridBooleanCellProps extends GridRenderCellParams, Omit<SvgIconProps, 'tabIndex' | 'id'> {
  hideDescendantCount?: boolean;
}

function GridBooleanCellRaw(props: GridBooleanCellProps) {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    rowNode,
    colDef,
    cellMode,
    isEditable,
    hasFocus,
    tabIndex,
    hideDescendantCount,
    ...other
  } = props;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const Icon = React.useMemo(
    () => (value ? rootProps.slots.booleanCellTrueIcon : rootProps.slots.booleanCellFalseIcon),
    [rootProps.slots.booleanCellFalseIcon, rootProps.slots.booleanCellTrueIcon, value],
  );

  return (
    <Icon
      fontSize="small"
      className={classes.root}
      titleAccess={apiRef.current.getLocaleText(
        value ? 'booleanCellTrueLabel' : 'booleanCellFalseLabel',
      )}
      data-value={Boolean(value)}
      {...other}
    />
  );
}

GridBooleanCellRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focus: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  hideDescendantCount: PropTypes.bool,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any,
} as any;

const GridBooleanCell = React.memo(GridBooleanCellRaw);

export { GridBooleanCell };

export const renderBooleanCell: GridColDef['renderCell'] = (params: GridBooleanCellProps) => {
  if (params.field !== '__row_group_by_columns_group__' && isAutogeneratedRowNode(params.rowNode)) {
    return '';
  }

  return <GridBooleanCell {...params} />;
};
