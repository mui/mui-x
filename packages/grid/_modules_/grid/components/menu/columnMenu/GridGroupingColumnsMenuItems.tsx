import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridGroupingColumnsSanitizedModelSelector } from '../../../hooks/features/groupingColumns/gridGroupingColumnsSelector';
import {
  getGroupingCriteriaFieldFromGroupingColDefField,
  GROUPING_COLUMN_SINGLE,
  isGroupingColumn,
} from '../../../hooks/features/groupingColumns/gridGroupingColumnsUtils';
import { gridColumnLookupSelector } from '../../../hooks/features/columns/gridColumnsSelector';

interface GridGroupingColumnsMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const GridGroupingColumnsMenuItems = (props: GridGroupingColumnsMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const groupingColumnsModel = useGridSelector(apiRef, gridGroupingColumnsSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const isGrouped = React.useMemo(
    () => column?.field && groupingColumnsModel.includes(column.field),
    [column, groupingColumnsModel],
  );

  const renderGroupingMenuItem = (field: string) => {
    const name = columnsLookup[field].headerName ?? field;

    const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.addGroupingCriteria(field);
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
      apiRef.current.removeGroupingCriteria(field);
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
          {groupingColumnsModel.map(renderUnGroupingMenuItem)}
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

  if (!column.canBeGrouped) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider />
      {renderGroupingMenuItem(column.field)}
    </React.Fragment>
  );
};

GridGroupingColumnsMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridGroupingColumnsMenuItems };
