import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  gridColumnLookupSelector,
  useGridSelector,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export function GridColumnMenuRowUngroupItem(props: GridColumnMenuItemProps) {
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
      <rootProps.slots.baseMenuItem onClick={ungroupColumn}>
        <ListItemIcon>
          <rootProps.slots.columnMenuUngroupIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{apiRef.current.getLocaleText('unGroupColumn')(name)}</ListItemText>
      </rootProps.slots.baseMenuItem>
    );
  }

  return (
    <rootProps.slots.baseMenuItem onClick={groupColumn}>
      <ListItemIcon>
        <rootProps.slots.columnMenuGroupIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{apiRef.current.getLocaleText('groupColumn')(name)}</ListItemText>
    </rootProps.slots.baseMenuItem>
  );
}
