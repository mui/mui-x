import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, type GridColDef } from '@mui/x-data-grid';
import { type GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';

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
  privateApiRef: RefObject<GridPrivateApiPro>,
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
        headerName: privateApiRef.current.getLocaleText('rowReorderingHeaderName'),
      };

      const shouldHaveReorderColumn = props.rowReordering;
      const hasReorderColumn = columnsState.lookup[reorderColumn.field] != null;

      if (shouldHaveReorderColumn && !hasReorderColumn) {
        columnsState.lookup[reorderColumn.field] = reorderColumn;
        columnsState.orderedFields = [reorderColumn.field, ...columnsState.orderedFields];
      } else if (!shouldHaveReorderColumn && hasReorderColumn) {
        delete columnsState.lookup[reorderColumn.field];
        columnsState.orderedFields = columnsState.orderedFields.filter(
          (field) => field !== reorderColumn.field,
        );
      } else if (shouldHaveReorderColumn && hasReorderColumn) {
        columnsState.lookup[reorderColumn.field] = {
          ...reorderColumn,
          ...columnsState.lookup[reorderColumn.field],
        };
        // If the column is not in the columns array (not a custom reorder column), move it to the beginning of the column order
        if (!props.columns.some((col) => col.field === GRID_REORDER_COL_DEF.field)) {
          columnsState.orderedFields = [
            reorderColumn.field,
            ...columnsState.orderedFields.filter((field) => field !== reorderColumn.field),
          ];
        }
      }

      return columnsState;
    },
    [privateApiRef, classes, props.columns, props.rowReordering],
  );

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateReorderColumn);
};
