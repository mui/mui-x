import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

  if (rowGroupingModel.includes(column.field)) {
    if (condensed) {
      return (
        <Stack
          px={1.5}
          py={1}
          direction="row"
          sx={{
            '& .MuiButton-root': {
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
            },
          }}
        >
          <Button
            onClick={ungroupColumn}
            key={column.field}
            startIcon={<WorkspacesIcon fontSize="small" />}
            color="inherit"
          >
            {apiRef.current.getLocaleText('unGroupColumn')(name)}
          </Button>
        </Stack>
      );
    }
    return (
      <MenuItem onClick={ungroupColumn}>
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </MenuItem>
    );
  }

  return condensed ? (
    <Stack
      px={1.5}
      py={1}
      direction="row"
      sx={{
        '& .MuiButton-root': {
          fontSize: '16px',
          fontWeight: '400',
          textTransform: 'none',
        },
      }}
    >
      <Button
        onClick={groupColumn}
        key={column.field}
        startIcon={<GroupWorkIcon fontSize="small" />}
        color="inherit"
      >
        {apiRef.current.getLocaleText('groupColumn')(name)}
      </Button>
    </Stack>
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
