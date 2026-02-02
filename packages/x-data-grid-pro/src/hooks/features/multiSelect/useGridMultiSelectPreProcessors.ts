'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { type GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import { GRID_MULTI_SELECT_COL_DEF } from '../../../colDef/gridMultiSelectColDef';

export const useGridMultiSelectPreProcessors = (apiRef: RefObject<GridPrivateApiPro>) => {
  const applyMultiSelectDefaults = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const newLookup = { ...columnsState.lookup };

      Object.keys(newLookup).forEach((field) => {
        const column = newLookup[field];
        if (column.type === 'multiSelect') {
          // Apply multiSelect defaults (renderCell, renderEditCell, filterOperators, etc.)
          // User props override defaults
          newLookup[field] = {
            ...GRID_MULTI_SELECT_COL_DEF,
            ...column,
          };
        }
      });

      return {
        ...columnsState,
        lookup: newLookup,
      };
    },
    [],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', applyMultiSelectDefaults);
};
