import * as React from 'react';
import {
  GridPinnedColumnFields,
  GridPipeProcessor,
  gridPinnedColumnsSelector,
  useGridRegisterPipeProcessor,
  eslintUseValue,
  gridVisiblePinnedColumnDefinitionsSelector,
} from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridPrivateApiPro } from '../../../models/gridApiPro';

export const useGridColumnPinningPreProcessors = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const { disableColumnPinning } = props;

  let pinnedColumns: GridPinnedColumnFields | null;
  if (apiRef.current.state.columns) {
    pinnedColumns = gridPinnedColumnsSelector(apiRef.current.state);
  } else {
    pinnedColumns = null;
  }

  const prevAllPinnedColumns = React.useRef<string[]>([]);

  const reorderPinnedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      eslintUseValue(pinnedColumns);

      if (columnsState.orderedFields.length === 0 || disableColumnPinning) {
        return columnsState;
      }

      // HACK: This is a hack needed because the pipe processors aren't pure enough. What
      // they should be is `gridState -> gridState` transformers, but they only transform a slice
      // of the state, not the full state. So if they need access to other parts of the state (like
      // the `state.columns.orderedFields` in this case), they might lag behind because the selectors
      // are selecting the old state in `apiRef`, not the state being computed in the current pipe processor.
      const savedState = apiRef.current.state;
      apiRef.current.state = { ...savedState, columns: columnsState as unknown as any };

      const visibleColumns = gridVisiblePinnedColumnDefinitionsSelector(apiRef);

      apiRef.current.state = savedState;
      // HACK: Ends here //

      const leftPinnedColumns = visibleColumns.left.map((c) => c.field);
      const rightPinnedColumns = visibleColumns.right.map((c) => c.field);

      let newOrderedFields: string[];
      const allPinnedColumns = [...leftPinnedColumns, ...rightPinnedColumns];

      const { orderedFieldsBeforePinningColumns } = apiRef.current.caches.columnPinning;

      if (orderedFieldsBeforePinningColumns) {
        newOrderedFields = new Array(columnsState.orderedFields.length).fill(null);
        const newOrderedFieldsBeforePinningColumns = [...newOrderedFields];

        // Contains the fields not added to the orderedFields array yet
        const remainingFields = [...columnsState.orderedFields];

        // First, we check if the column was unpinned since the last processing.
        // If yes and it still exists, we move it back to the same position it was before pinning
        prevAllPinnedColumns.current.forEach((field) => {
          if (!allPinnedColumns.includes(field) && columnsState.lookup[field]) {
            // Get the position before pinning
            const index = orderedFieldsBeforePinningColumns.indexOf(field);
            newOrderedFields[index] = field;
            newOrderedFieldsBeforePinningColumns[index] = field;
            // This field was already consumed so we prevent from being added again
            remainingFields.splice(remainingFields.indexOf(field), 1);
          }
        });

        // For columns still pinned, we keep stored their original positions
        allPinnedColumns.forEach((field) => {
          let index = orderedFieldsBeforePinningColumns.indexOf(field);
          // If index = -1, the pinned field didn't exist in the last processing, it's possibly being added now
          // If index >= newOrderedFieldsBeforePinningColumns.length, then one or more columns were removed
          // In both cases, use the position from the columns array
          // TODO: detect removed columns and decrease the positions after it
          if (index === -1 || index >= newOrderedFieldsBeforePinningColumns.length) {
            index = columnsState.orderedFields.indexOf(field);
          }

          // The fallback above may make the column to be inserted in a position already occupied
          // In this case, put it in any empty slot available
          if (newOrderedFieldsBeforePinningColumns[index] !== null) {
            index = 0;
            while (newOrderedFieldsBeforePinningColumns[index] !== null) {
              index += 1;
            }
          }

          newOrderedFields[index] = field;
          newOrderedFieldsBeforePinningColumns[index] = field;
          // This field was already consumed so we prevent from being added again
          remainingFields.splice(remainingFields.indexOf(field), 1);
        });

        // The fields remaining are those that're neither pinnned nor were unpinned
        // For these, we spread them across both arrays making sure to not override existing values
        let i = 0;
        remainingFields.forEach((field) => {
          while (newOrderedFieldsBeforePinningColumns[i] !== null) {
            i += 1;
          }
          newOrderedFieldsBeforePinningColumns[i] = field;
          newOrderedFields[i] = field;
        });

        apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns =
          newOrderedFieldsBeforePinningColumns;
      } else {
        newOrderedFields = [...columnsState.orderedFields];
        apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns = [
          ...columnsState.orderedFields,
        ];
      }

      prevAllPinnedColumns.current = allPinnedColumns;

      const centerColumns = newOrderedFields.filter((field) => {
        return !leftPinnedColumns.includes(field) && !rightPinnedColumns.includes(field);
      });

      return {
        ...columnsState,
        orderedFields: [...leftPinnedColumns, ...centerColumns, ...rightPinnedColumns],
      };
    },
    [apiRef, disableColumnPinning, pinnedColumns],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', reorderPinnedColumns);

  const isColumnPinned = React.useCallback<GridPipeProcessor<'isColumnPinned'>>(
    (initialValue, field) => apiRef.current.isColumnPinned(field),
    [apiRef],
  );
  useGridRegisterPipeProcessor(apiRef, 'isColumnPinned', isColumnPinned);
};
