import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import { useGridSelector, gridColumnLookupSelector, GridColDef } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  getRowGroupingCriteriaFromGroupingField,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  isGroupingColumn,
} from '../hooks/features/rowGrouping/gridRowGroupingUtils';

interface GridRowGroupingColumnMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
  condensed?: boolean;
}

const GridRowGroupingColumnMenuItems = (props: GridRowGroupingColumnMenuItemsProps) => {
  const { column, onClick, condensed } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const renderUnGroupingMenuItem = (field: string) => {
    const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.removeRowGroupingCriteria(field);
      if (onClick) {
        onClick(event);
      }
    };

    const name = columnsLookup[field].headerName ?? field;

    if (condensed) {
      return (
        <MenuItem onClick={ungroupColumn} key={field}>
          <ListItemIcon>
            <GroupWorkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{apiRef.current.getLocaleText('unGroupColumn')(name)}</ListItemText>
        </MenuItem>
      );
    }

    return (
      <MenuItem onClick={ungroupColumn} key={field}>
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </MenuItem>
    );
  };

  if (!column || !isGroupingColumn(column.field)) {
    return null;
  }

  if (column.field === GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
    return <React.Fragment>{rowGroupingModel.map(renderUnGroupingMenuItem)}</React.Fragment>;
  }

  return renderUnGroupingMenuItem(getRowGroupingCriteriaFromGroupingField(column.field)!);
};

GridRowGroupingColumnMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridRowGroupingColumnMenuItems };
