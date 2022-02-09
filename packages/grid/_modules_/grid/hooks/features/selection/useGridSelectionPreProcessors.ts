import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { getDataGridUtilityClass } from '../../../gridClasses';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../models/colDef/gridCheckboxSelectionColDef';

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

export const useGridSelectionPreProcessors = (apiRef: GridApiRef, props) => {
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  const updateSelectionColumn = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const selectionColumn: GridColDef = {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        cellClassName: classes.cellCheckbox,
        headerClassName: classes.columnHeaderCheckbox,
        headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName'),
      };

      const shouldHaveSelectionColumn = props.checkboxSelection;
      const haveSelectionColumn = columnsState.lookup[selectionColumn.field] != null;

      if (shouldHaveSelectionColumn && !haveSelectionColumn) {
        columnsState.lookup[selectionColumn.field] = selectionColumn;
        columnsState.all = [selectionColumn.field, ...columnsState.all];
      } else if (!shouldHaveSelectionColumn && haveSelectionColumn) {
        delete columnsState.lookup[selectionColumn.field];
        columnsState.all = columnsState.all.filter((field) => field !== selectionColumn.field);
      }

      return columnsState;
    },
    [apiRef, classes, props.checkboxSelection],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
};
