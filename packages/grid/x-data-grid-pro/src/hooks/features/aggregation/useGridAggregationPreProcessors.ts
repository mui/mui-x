import * as React from 'react';
import {
  GridPreProcessor,
  useGridRegisterPreProcessor,
} from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { wrapColumnWithAggregation } from './gridAggregationUtils';

export const useGridAggregationPreProcessors = (apiRef: React.MutableRefObject<GridApiPro>) => {
  const updateGroupingColumn = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      columnsState.all.forEach((field) => {
        const colDef = columnsState.lookup[field];

        wrapColumnWithAggregation({ colDef, apiRef });
      });

      return columnsState;
    },
    [],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
};
