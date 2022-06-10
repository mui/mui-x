import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { getDataGridUtilityClass } from '../../../constants';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_CHECKBOX_SELECTION_FIELD } from '../../../colDef';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

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

export const useGridSelectionPreProcessors = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
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
      };

      const shouldHaveSelectionColumn = props.checkboxSelection;
      const haveSelectionColumn = columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] != null;

      if (shouldHaveSelectionColumn && !haveSelectionColumn) {
        columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = selectionColumn;
        columnsState.all = [GRID_CHECKBOX_SELECTION_FIELD, ...columnsState.all];
      } else if (!shouldHaveSelectionColumn && haveSelectionColumn) {
        delete columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD];
        columnsState.all = columnsState.all.filter(
          (field) => field !== GRID_CHECKBOX_SELECTION_FIELD,
        );
      } else if (shouldHaveSelectionColumn && haveSelectionColumn) {
        columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = {
          ...selectionColumn,
          ...columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD],
        };
      }

      return columnsState;
    },
    [apiRef, classes, props.checkboxSelection],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
};
