'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import {
  gridPivotActiveSelector,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import type { GridColumnsState } from '@mui/x-data-grid-pro';
import type { GridPipeProcessor, GridStateColDef } from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import type { GridComputedColumnsModel } from '../computedColumns/gridComputedColumnsInterfaces';
import { ensureFormulaInternalCache } from './gridFormulaUtils';
import { ensureComputedColumnRecords } from './gridComputedColumnsRuntime';

const EMPTY_MODEL: GridComputedColumnsModel = [];

/**
 * The position of a computed column that is missing from `orderedFields` although it was part of
 * the previous columns state: a `columns` prop update rebuilds the order from the prop alone.
 * The column goes back after the closest of its previous predecessors that still exists.
 */
function getIndexFromPreviousOrder(
  field: string,
  orderedFields: string[],
  previousOrderedFields: string[],
): number | null {
  const previousIndex = previousOrderedFields.indexOf(field);
  if (previousIndex === -1) {
    return null;
  }
  for (let i = previousIndex - 1; i >= 0; i -= 1) {
    const index = orderedFields.indexOf(previousOrderedFields[i]);
    if (index !== -1) {
      return index + 1;
    }
  }
  return 0;
}

export const useGridComputedColumnsPreProcessors = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'disableFormulas'
    | 'disableComputedColumns'
    | 'dataSource'
    | 'computedColDef'
    | 'formulaFunctions'
  >,
) => {
  const hasDataSource = !!props.dataSource;
  // Read lazily. `formulaFunctions` only seeds the cache (the registry follows the prop in
  // `useGridFormula`), and `computedColDef` is often an inline object or function: as a dependency
  // of the processor, it would hydrate the columns again on every render of the parent.
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const injectComputedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const cache = ensureFormulaInternalCache(apiRef, propsRef.current);
      const state = apiRef.current.state as Partial<GridStatePremium>;
      const model = state.computedColumns?.model ?? EMPTY_MODEL;
      const pivotActive = gridPivotActiveSelector(apiRef) === true;
      const enabled =
        !props.disableFormulas && !props.disableComputedColumns && !hasDataSource && !pivotActive;

      if (
        process.env.NODE_ENV !== 'production' &&
        model.length > 0 &&
        !props.disableFormulas &&
        !props.disableComputedColumns
      ) {
        if (hasDataSource) {
          warnOnce([
            'MUI X Data Grid: Computed columns are not supported with the `dataSource` prop.',
            'The `computedColumns` model is kept, but its columns are not added to the grid.',
          ]);
        } else if (pivotActive) {
          warnOnce([
            'MUI X Data Grid: Computed columns are not supported while pivoting is active.',
            'They are removed from the grid and come back when pivoting is deactivated.',
          ]);
        }
      }

      ensureComputedColumnRecords(
        apiRef,
        cache,
        enabled ? model : EMPTY_MODEL,
        propsRef.current.computedColDef,
      );
      const { records } = cache.computedColumns;

      let removedFields: Set<string> | null = null;
      for (const field of Object.keys(columnsState.lookup)) {
        if (columnsState.lookup[field].computed && !records.has(field)) {
          delete columnsState.lookup[field];
          removedFields ??= new Set();
          removedFields.add(field);
        }
      }
      if (removedFields !== null) {
        columnsState.orderedFields = columnsState.orderedFields.filter(
          (field) => !removedFields.has(field),
        );
      }
      if (records.size === 0) {
        return columnsState;
      }

      const previousColumns = state.columns as GridColumnsState | undefined;
      const { pendingColumnIndexes } = apiRef.current.caches.computedColumns;
      for (const [field, record] of records) {
        const existing = columnsState.lookup[field];
        if (existing !== undefined && !existing.computed) {
          warnOnce([
            `MUI X Data Grid: The computed column "${field}" uses the field of an existing column, so it is not added to the grid.`,
            'Each computed column needs a field that no other column uses.',
            'Change the `field` of the computed column definition.',
          ]);
          continue;
        }

        // The width chosen by the user outlives the definition updates and the
        // `columns` prop updates, which both create the column from scratch.
        const previous = (existing ?? previousColumns?.lookup[field]) as
          GridStateColDef | undefined;
        columnsState.lookup[field] =
          previous?.computed && previous.hasBeenResized
            ? { ...record.colDef, width: previous.width, flex: previous.flex, hasBeenResized: true }
            : { ...record.colDef, hasBeenResized: false };

        if (columnsState.orderedFields.includes(field)) {
          continue;
        }
        const indexFromPreviousOrder = getIndexFromPreviousOrder(
          field,
          columnsState.orderedFields,
          previousColumns?.orderedFields ?? [],
        );
        const insertionIndex = indexFromPreviousOrder ?? pendingColumnIndexes.get(field);
        pendingColumnIndexes.delete(field);
        if (insertionIndex === undefined) {
          columnsState.orderedFields.push(field);
        } else {
          const index = Math.max(0, Math.min(insertionIndex, columnsState.orderedFields.length));
          columnsState.orderedFields.splice(index, 0, field);
        }
      }

      return columnsState;
    },
    [apiRef, props.disableFormulas, props.disableComputedColumns, hasDataSource],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', injectComputedColumns);
};
