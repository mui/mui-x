'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import {
  type GridStateColDef,
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_MULTI_SELECT_COL_DEF } from '../../../colDef/gridMultiSelectColDef';

export const useGridMultiSelectPreProcessors = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const userColumnsLookup = React.useMemo(
    () => new Map(props.columns.map((col) => [col.field, col])),
    [props.columns],
  );

  const applyMultiSelectDefaults = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const { lookup } = columnsState;

      let newLookup: typeof lookup | null = null;
      const fields = Object.keys(lookup);
      for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        const column = lookup[field];
        if (column.type !== 'multiSelect') {
          continue;
        }
        if (newLookup === null) {
          newLookup = { ...lookup };
        }
        const userColumn = userColumnsLookup.get(field);
        const stateColumn = column as GridStateColDef;
        // Apply multiSelect defaults, then user's explicit props.
        // We use userColumn (not column) because column already has string defaults baked in.
        newLookup[field] = {
          ...GRID_MULTI_SELECT_COL_DEF,
          ...userColumn,
          field,
          ...(stateColumn.hasBeenResized && {
            width: stateColumn.width,
            flex: stateColumn.flex,
          }),
        };
      }

      if (newLookup === null) {
        return columnsState;
      }

      return { ...columnsState, lookup: newLookup };
    },
    [userColumnsLookup],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', applyMultiSelectDefaults);
};
