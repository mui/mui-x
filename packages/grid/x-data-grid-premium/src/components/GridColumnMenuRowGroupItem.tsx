import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  useGridSelector,
  gridColumnLookupSelector,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  getRowGroupingCriteriaFromGroupingField,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  isGroupingColumn,
} from '../hooks/features/rowGrouping/gridRowGroupingUtils';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridColumnMenuRowGroupItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const rootProps = useGridRootProps();

  const renderUnGroupingMenuItem = (field: string) => {
    const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.removeRowGroupingCriteria(field);
      onClick(event);
    };

    const groupedColumn = columnsLookup[field];
    const name = groupedColumn.headerName ?? field;
    return (
      <MenuItem onClick={ungroupColumn} key={field} disabled={!groupedColumn.groupable}>
        <ListItemIcon>
          <rootProps.slots.columnMenuUngroupIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{apiRef.current.getLocaleText('unGroupColumn')(name)}</ListItemText>
      </MenuItem>
    );
  };

  if (!colDef || !isGroupingColumn(colDef.field)) {
    return null;
  }

  if (colDef.field === GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
    return <React.Fragment>{rowGroupingModel.map(renderUnGroupingMenuItem)}</React.Fragment>;
  }

  return renderUnGroupingMenuItem(getRowGroupingCriteriaFromGroupingField(colDef.field)!);
}

GridColumnMenuRowGroupItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuRowGroupItem };
