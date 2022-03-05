import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { GridPreProcessor, useGridRegisterPreProcessor } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { wrapColumnWithAggregation } from './gridAggregationUtils';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridAggregationColumnMenuItems } from '../../../components/GridAggregationColumnMenuItems';

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'aggregationFunctions'>,
) => {
  const updateGroupingColumn = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      columnsState.all.forEach((field) => {
        const colDef = columnsState.lookup[field];

        wrapColumnWithAggregation({
          colDef,
          apiRef,
          aggregationFunctions: props.aggregationFunctions,
        });
      });

      return columnsState;
    },
    [apiRef, props.aggregationFunctions],
  );

  const addColumnMenuButtons = React.useCallback<GridPreProcessor<'columnMenu'>>(
    (initialValue, column) => {
      if (column.aggregable === false) {
        return initialValue;
      }

      return [...initialValue, <Divider />, <GridAggregationColumnMenuItems />];
    },
    [],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterPreProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
};
