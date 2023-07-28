import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { gridPinnedColumnsSelector } from './gridColumnPinningSelector';
import { columnPinningStateInitializer } from './useGridColumnPinning';
import { GridApiPro, GridPrivateApiPro } from '../../../models/gridApiPro';
import { filterColumns } from '../../../components/DataGridProVirtualScroller';

export const useGridColumnPinningPreProcessors = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const { disableColumnPinning, pinnedColumns: pinnedColumnsProp, initialState } = props;
  const theme = useTheme();
  let pinnedColumns = gridPinnedColumnsSelector(apiRef.current.state);
  if (pinnedColumns == null) {
    // Since the state is not ready yet lets use the initializer to get which
    // columns should be pinned initially.
    const initializedState = columnPinningStateInitializer(
      apiRef.current.state,
      { disableColumnPinning, pinnedColumns: pinnedColumnsProp, initialState },
      apiRef,
    ) as GridApiPro['state'];
    pinnedColumns = gridPinnedColumnsSelector(initializedState);
  }

  const prevAllPinnedColumns = React.useRef<string[]>([]);

  const reorderPinnedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (columnsState.orderedFields.length === 0 || disableColumnPinning) {
        return columnsState;
      }

      const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
        pinnedColumns,
        columnsState.orderedFields,
        theme.direction === 'rtl',
      );

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
    [apiRef, disableColumnPinning, pinnedColumns, theme.direction],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', reorderPinnedColumns);
};
