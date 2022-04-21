import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass, GridColDef } from '@mui/x-data-grid';
import {
  GridApiCommunity,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '@mui/x-data-grid-pro/models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  return React.useMemo(() => {
    const slots = {
      rowReorderCellContainer: ['rowReorderCellContainer'],
      columnHeaderReorder: ['columnHeaderReorder'],
    };

    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export const useGridRowReorderPreProcessors = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: DataGridProProcessedProps,
) => {
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  const updateReorderColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const reorderColumn: GridColDef = {
        ...GRID_REORDER_COL_DEF,
        cellClassName: classes.rowReorderCellContainer,
        headerClassName: classes.columnHeaderReorder,
        headerName: apiRef.current.getLocaleText('rowReorderingHeaderName'),
      };

      const shouldHaveReorderColumn = props.rowReordering;
      const haveReorderColumn = columnsState.lookup[reorderColumn.field] != null;

      if (shouldHaveReorderColumn && haveReorderColumn) {
        return columnsState;
      }

      if (shouldHaveReorderColumn && !haveReorderColumn) {
        columnsState.lookup[reorderColumn.field] = reorderColumn;
        columnsState.all = [reorderColumn.field, ...columnsState.all];
      } else if (!shouldHaveReorderColumn && haveReorderColumn) {
        delete columnsState.lookup[reorderColumn.field];
        columnsState.all = columnsState.all.filter((field) => field !== reorderColumn.field);
      }

      return columnsState;
    },
    [apiRef, classes, props.rowReordering],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateReorderColumn);
};
