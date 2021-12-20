import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  getGroupingCriteriaFieldFromGroupingColDefField,
  GROUPING_COLUMN_SINGLE,
  isGroupingColumn,
} from '../../../hooks/features/rowGrouping/gridRowGroupingUtils';
import { gridColumnLookupSelector } from '../../../hooks/features/columns/gridColumnsSelector';

interface GridGroupingColumnsMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const GridRowGroupingMenuItems = (props: GridGroupingColumnsMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const isGrouped = React.useMemo(
    () => column?.field && rowGroupingModel.includes(column.field),
    [column, rowGroupingModel],
  );

  const renderGroupingMenuItem = (field: string) => {
    const name = columnsLookup[field].headerName ?? field;

    const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.addRowGroupingCriteria(field);
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <MenuItem onClick={groupColumn}>{apiRef.current.getLocaleText('groupColumn')(name)}</MenuItem>
    );
  };

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

  if (!column) {
    return null;
  }

  if (isGroupingColumn(column.field)) {
    if (column.field === GROUPING_COLUMN_SINGLE) {
      return (
        <React.Fragment>
          <Divider />
          {rowGroupingModel.map(renderUnGroupingMenuItem)}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Divider />
        {renderUnGroupingMenuItem(getGroupingCriteriaFieldFromGroupingColDefField(column.field)!)}
      </React.Fragment>
    );
  }

  if (isGrouped) {
    return (
      <React.Fragment>
        <Divider />
        {renderUnGroupingMenuItem(column.field)}
      </React.Fragment>
    );
  }

  if (!column.groupable) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider />
      {renderGroupingMenuItem(column.field)}
    </React.Fragment>
  );
};

GridRowGroupingMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridRowGroupingMenuItems };
