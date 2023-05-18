import * as React from 'react';
import PropTypes from 'prop-types';
import {
  gridColumnLookupSelector,
  useGridSelector,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridColumnMenuRowUngroupItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const rootProps = useGridRootProps();

  if (!colDef.groupable) {
    return null;
  }

  const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.removeRowGroupingCriteria(colDef.field);
    onClick(event);
  };

  const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.addRowGroupingCriteria(colDef.field);
    onClick(event);
  };

  const name = columnsLookup[colDef.field].headerName ?? colDef.field;

  if (rowGroupingModel.includes(colDef.field)) {
    return (
      <rootProps.slots.baseMenuItem onClick={ungroupColumn} {...rootProps.slotProps?.baseMenuItem}>
        <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
          <rootProps.slots.columnMenuUngroupIcon fontSize="small" />
        </rootProps.slots.baseListItemIcon>
        <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
          {apiRef.current.getLocaleText('unGroupColumn')(name)}
        </rootProps.slots.baseListItemText>
      </rootProps.slots.baseMenuItem>
    );
  }

  return (
    <rootProps.slots.baseMenuItem onClick={groupColumn} {...rootProps.slotProps?.baseMenuItem}>
      <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
        <rootProps.slots.columnMenuGroupIcon fontSize="small" />
      </rootProps.slots.baseListItemIcon>
      <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
        {apiRef.current.getLocaleText('groupColumn')(name)}
      </rootProps.slots.baseListItemText>
    </rootProps.slots.baseMenuItem>
  );
}

GridColumnMenuRowUngroupItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuRowUngroupItem };
