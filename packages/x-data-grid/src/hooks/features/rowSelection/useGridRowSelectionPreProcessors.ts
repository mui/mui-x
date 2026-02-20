import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import composeClasses from '@mui/utils/composeClasses';
import type { GridColDef } from '../../../models/colDef/gridColDef';
import { type GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { getDataGridUtilityClass } from '../../../constants';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_CHECKBOX_SELECTION_FIELD } from '../../../colDef';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  return React.useMemo(() => {
    const slots = {
      cellCheckbox: ['cellCheckbox'],
      columnHeaderCheckbox: ['columnHeaderCheckbox'],
    };

    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export const useGridRowSelectionPreProcessors = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: DataGridProcessedProps,
) => {
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  const updateSelectionColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const selectionColumn: GridColDef = {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        cellClassName: classes.cellCheckbox,
        headerClassName: classes.columnHeaderCheckbox,
        headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName'),
        ...props.checkboxColDef,
      };

      const shouldHaveSelectionColumn = props.checkboxSelection;
      const hasSelectionColumn = columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] != null;

      if (shouldHaveSelectionColumn && !hasSelectionColumn) {
        columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = selectionColumn;
        columnsState.orderedFields = [GRID_CHECKBOX_SELECTION_FIELD, ...columnsState.orderedFields];
      } else if (!shouldHaveSelectionColumn && hasSelectionColumn) {
        delete columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD];
        columnsState.orderedFields = columnsState.orderedFields.filter(
          (field) => field !== GRID_CHECKBOX_SELECTION_FIELD,
        );
      } else if (shouldHaveSelectionColumn && hasSelectionColumn) {
        columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = {
          ...selectionColumn,
          ...columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD],
        };
        // If the column is not in the columns array (not a custom selection column), move it to the beginning of the column order
        if (!props.columns.some((col) => col.field === GRID_CHECKBOX_SELECTION_FIELD)) {
          columnsState.orderedFields = [
            GRID_CHECKBOX_SELECTION_FIELD,
            ...columnsState.orderedFields.filter(
              (field) => field !== GRID_CHECKBOX_SELECTION_FIELD,
            ),
          ];
        }
      }

      return columnsState;
    },
    [apiRef, classes, props.columns, props.checkboxSelection, props.checkboxColDef],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
};
