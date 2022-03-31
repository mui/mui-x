import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass, GridColDef } from '@mui/x-data-grid';
import {
  GridApiCommunity,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import { DataGridProcessedProps } from '@mui/x-data-grid/models/props/DataGridProps';
import { GRID_REORDER_COL_DEF } from '@mui/x-data-grid-pro/colDef';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  return React.useMemo(() => {
    const slots = {
      cellReorder: ['cellReorder'],
      columnHeaderReorder: ['columnHeaderReorder'],
    };

    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export const useGridRowReorderPreProcessors = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: DataGridProcessedProps,
) => {
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  const updateReorderColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const reorderColumn: GridColDef = {
        ...GRID_REORDER_COL_DEF,
        cellClassName: classes.cellReorder,
        headerClassName: classes.columnHeaderReorder,
      };

      const shouldHaveReorderColumn = props.enableRowReorder;
      const haveReorderColumn = columnsState.lookup[reorderColumn.field] != null;

      if (shouldHaveReorderColumn && !haveReorderColumn) {
        columnsState.lookup[reorderColumn.field] = reorderColumn;
        columnsState.all = [reorderColumn.field, ...columnsState.all];
      } else if (!shouldHaveReorderColumn && haveReorderColumn) {
        delete columnsState.lookup[reorderColumn.field];
        columnsState.all = columnsState.all.filter((field) => field !== reorderColumn.field);
      }

      return columnsState;
    },
    [classes, props.enableRowReorder],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateReorderColumn);
};
