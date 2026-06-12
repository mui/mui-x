'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import {
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { wrapColumnWithFormula, unwrapColumnFromFormula } from './wrapColumnWithFormula';

export const useGridFormulaPreProcessors = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'disableFormulas' | 'dataSource'>,
) => {
  const updateFormulaColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const formulasEnabled = !props.disableFormulas && !props.dataSource;

      columnsState.orderedFields.forEach((field) => {
        let column = unwrapColumnFromFormula(columnsState.lookup[field]);
        if (formulasEnabled && column.allowFormulas) {
          column = wrapColumnWithFormula(column, apiRef);
        }
        columnsState.lookup[field] = column;
      });

      return columnsState;
    },
    [apiRef, props.disableFormulas, props.dataSource],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateFormulaColumns);
};
