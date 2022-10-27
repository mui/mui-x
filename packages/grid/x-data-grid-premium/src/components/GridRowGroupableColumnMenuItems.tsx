import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { gridColumnLookupSelector, useGridSelector, GridColDef } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';

interface GridRowGroupableColumnMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
  condensed?: boolean;
}

const GridRowGroupableColumnMenuItems = (props: GridRowGroupableColumnMenuItemsProps) => {
  const { column, onClick, condensed } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  if (!column?.groupable) {
    return null;
  }

  const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.removeRowGroupingCriteria(column.field);
    if (onClick) {
      onClick(event);
    }
  };

  const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.addRowGroupingCriteria(column.field);
    if (onClick) {
      onClick(event);
    }
  };

  const name = columnsLookup[column.field].headerName ?? column.field;

  if (condensed) {
    return (
      <MenuItem onClick={groupColumn} key={column.field}>
        <ListItemIcon>
          <GroupWorkIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{apiRef.current.getLocaleText('groupColumn')(name)}</ListItemText>
      </MenuItem>
    );
  }

  if (rowGroupingModel.includes(column.field)) {
    if (condensed) {
      return (
        <MenuItem onClick={ungroupColumn} key={column.field}>
          <ListItemIcon>
            <WorkspacesIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{apiRef.current.getLocaleText('unGroupColumn')(name)}</ListItemText>
        </MenuItem>
      );
    }
    return (
      <MenuItem onClick={ungroupColumn}>
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </MenuItem>
    );
  }

  return condensed ? (
    <MenuItem onClick={groupColumn} key={column.field}>
      <ListItemIcon>
        <GroupWorkIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{apiRef.current.getLocaleText('groupColumn')(name)}</ListItemText>
    </MenuItem>
  ) : (
    <MenuItem onClick={groupColumn}>{apiRef.current.getLocaleText('groupColumn')(name)}</MenuItem>
  );
};

GridRowGroupableColumnMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridRowGroupableColumnMenuItems };
