import * as React from 'react';
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

export function GridColumnMenuRowGroupItem(props: GridColumnMenuItemProps) {
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
      <rootProps.slots.baseMenuItem
        onClick={ungroupColumn}
        key={field}
        disabled={!groupedColumn.groupable}
        iconStart={<rootProps.slots.columnMenuUngroupIcon fontSize="small" />}
      >
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </rootProps.slots.baseMenuItem>
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
