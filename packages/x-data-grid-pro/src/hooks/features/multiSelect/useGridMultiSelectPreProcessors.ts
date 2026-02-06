'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { type GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_MULTI_SELECT_COL_DEF } from '../../../colDef/gridMultiSelectColDef';

export const useGridMultiSelectPreProcessors = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const applyMultiSelectDefaults = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const newLookup = { ...columnsState.lookup };

      // Create a lookup of user-provided columns for quick access
      const userColumnsLookup = new Map(props.columns.map((col) => [col.field, col]));

      Object.keys(newLookup).forEach((field) => {
        const column = newLookup[field];
        if (column.type === 'multiSelect') {
          // Get the original user-provided column definition
          const userColumn = userColumnsLookup.get(field);

          // Apply multiSelect defaults, then user's explicit props
          // We use userColumn (not column) because column already has string defaults baked in
          newLookup[field] = {
            ...GRID_MULTI_SELECT_COL_DEF,
            ...userColumn,
            // Preserve computed properties from the existing column state
            field,
            computedWidth: (column as any).computedWidth,
            hasBeenResized: (column as any).hasBeenResized,
          };
        }
      });

      return {
        ...columnsState,
        lookup: newLookup,
      };
    },
    [props.columns],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', applyMultiSelectDefaults);
};
