import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { gridColumnLookupSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { GridApiPro } from '../../../models/api/gridApiPro';

interface GridRowGroupableColumnMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const GridRowGroupableColumnMenuItems = (props: GridRowGroupableColumnMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext<GridApiPro>();
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
    return (
      <MenuItem onClick={ungroupColumn}>
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </MenuItem>
    );
  }

  return (
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
