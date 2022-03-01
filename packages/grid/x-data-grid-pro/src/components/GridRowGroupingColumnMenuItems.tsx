import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridSelector, gridColumnLookupSelector } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  getRowGroupingCriteriaFromGroupingField,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  isGroupingColumn,
} from '../hooks/features/rowGrouping/gridRowGroupingUtils';
import { GridColDef } from '../models/gridColDef';

interface GridRowGroupingColumnMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const GridRowGroupingColumnMenuItems = (props: GridRowGroupingColumnMenuItemsProps) => {
  const { column, onClick } = props;
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
