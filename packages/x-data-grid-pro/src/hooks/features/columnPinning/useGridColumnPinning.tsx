import * as React from 'react';
import {
  useGridSelector,
  gridVisibleColumnDefinitionsSelector,
  gridColumnsTotalWidthSelector,
  gridColumnPositionsSelector,
  useGridApiMethod,
  useGridApiEventHandler,
  GridEventListener,
  GridPinnedColumnPosition,
  gridColumnFieldsSelector,
} from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  gridPinnedColumnsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  GridStateInitializer,
  GridPinnedColumnFields,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { GridInitialStatePro } from '../../../models/gridStatePro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridColumnPinningApi } from './gridColumnPinningInterface';

export const columnPinningStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'pinnedColumns' | 'initialState'>
> = (state, props, apiRef) => {
  apiRef.current.caches.columnPinning = {
    orderedFieldsBeforePinningColumns: null,
  };

  let model: GridPinnedColumnFields;
  if (props.pinnedColumns) {
    model = props.pinnedColumns;
  } else if (props.initialState?.pinnedColumns) {
    model = props.initialState.pinnedColumns;
  } else {
    model = {};
  }

  return {
    ...state,
    pinnedColumns: model,
  };
};

export const useGridColumnPinning = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'disableColumnPinning'
    | 'initialState'
    | 'pinnedColumns'
    | 'onPinnedColumnsChange'
    | 'slotProps'
    | 'slots'
  >,
): void => {
  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);

  /**
   * PRE-PROCESSING
   */
  const calculateScrollLeft = React.useCallback<GridPipeProcessor<'scrollToIndexes'>>(
    (initialValue, params) => {
      const visiblePinnedColumns = gridVisiblePinnedColumnDefinitionsSelector(apiRef);

      if (
        !params.colIndex ||
        (visiblePinnedColumns.left.length === 0 && visiblePinnedColumns.right.length === 0)
      ) {
        return initialValue;
      }

      const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
      const columnsTotalWidth = gridColumnsTotalWidthSelector(apiRef);
      const columnPositions = gridColumnPositionsSelector(apiRef);
      const clientWidth = apiRef.current.virtualScrollerRef!.current!.clientWidth;

      // When using RTL, `scrollLeft` becomes negative, so we must ensure that we only compare values.
      const scrollLeft = Math.abs(apiRef.current.virtualScrollerRef!.current!.scrollLeft);
      const offsetWidth = visibleColumns[params.colIndex].computedWidth;
      const offsetLeft = columnPositions[params.colIndex];

      const leftPinnedColumnsWidth = columnPositions[visiblePinnedColumns.left.length];
      const rightPinnedColumnsWidth =
        columnsTotalWidth -
        columnPositions[columnPositions.length - visiblePinnedColumns.right.length];

      const elementBottom = offsetLeft + offsetWidth;
      if (elementBottom - (clientWidth - rightPinnedColumnsWidth) > scrollLeft) {
        const left = elementBottom - (clientWidth - rightPinnedColumnsWidth);
        return { ...initialValue, left };
      }
      if (offsetLeft < scrollLeft + leftPinnedColumnsWidth) {
        const left = offsetLeft - leftPinnedColumnsWidth;
        return { ...initialValue, left };
      }
      return initialValue;
    },
    [apiRef],
  );

  const addColumnMenuItems = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, colDef) => {
      if (props.disableColumnPinning) {
        return columnMenuItems;
      }

      if (colDef.pinnable === false) {
        return columnMenuItems;
      }

      return [...columnMenuItems, 'columnMenuPinningItem'];
    },
    [props.disableColumnPinning],
  );

  const checkIfCanBeReordered = React.useCallback<GridPipeProcessor<'canBeReordered'>>(
    (initialValue, { targetIndex }) => {
      const visiblePinnedColumns = gridVisiblePinnedColumnDefinitionsSelector(apiRef);

      if (visiblePinnedColumns.left.length === 0 && visiblePinnedColumns.right.length === 0) {
        return initialValue;
      }

      if (visiblePinnedColumns.left.length > 0 && targetIndex < visiblePinnedColumns.left.length) {
        return false;
      }

      if (visiblePinnedColumns.right.length > 0) {
        const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
        const firstRightPinnedColumnIndex =
          visibleColumns.length - visiblePinnedColumns.right.length;
        return targetIndex >= firstRightPinnedColumnIndex ? false : initialValue;
      }

      return initialValue;
    },
    [apiRef],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const pinnedColumnsToExport = gridPinnedColumnsSelector(apiRef.current.state);

      const shouldExportPinnedColumns =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the model is controlled
        props.pinnedColumns != null ||
        // Always export if the model has been initialized
        props.initialState?.pinnedColumns != null ||
        // Export if the model is not empty
        (pinnedColumnsToExport.left ?? []).length > 0 ||
        (pinnedColumnsToExport.right ?? []).length > 0;

      if (!shouldExportPinnedColumns) {
        return prevState;
      }

      return {
        ...prevState,
        pinnedColumns: pinnedColumnsToExport,
      };
    },
    [apiRef, props.pinnedColumns, props.initialState?.pinnedColumns],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePro>) => {
      const newPinnedColumns = context.stateToRestore.pinnedColumns;
      if (newPinnedColumns != null) {
        setState(apiRef, newPinnedColumns);
      }

      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'scrollToIndexes', calculateScrollLeft);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItems);
  useGridRegisterPipeProcessor(apiRef, 'canBeReordered', checkIfCanBeReordered);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  apiRef.current.registerControlState({
    stateId: 'pinnedColumns',
    propModel: props.pinnedColumns,
    propOnChange: props.onPinnedColumnsChange,
    stateSelector: gridPinnedColumnsSelector,
    changeEvent: 'pinnedColumnsChange',
  });

  const pinColumn = React.useCallback<GridColumnPinningApi['pinColumn']>(
    (field: string, side: GridPinnedColumnPosition) => {
      if (apiRef.current.isColumnPinned(field) === side) {
        return;
      }

      const otherSide =
        side === GridPinnedColumnPosition.RIGHT
          ? GridPinnedColumnPosition.LEFT
          : GridPinnedColumnPosition.RIGHT;

      const newPinnedColumns = {
        [side]: [...(pinnedColumns[side] || []), field],
        [otherSide]: (pinnedColumns[otherSide] || []).filter((column) => column !== field),
      };

      apiRef.current.setPinnedColumns(newPinnedColumns);
    },
    [apiRef, pinnedColumns],
  );

  const unpinColumn = React.useCallback<GridColumnPinningApi['unpinColumn']>(
    (field: string) => {
      apiRef.current.setPinnedColumns({
        left: (pinnedColumns.left || []).filter((column) => column !== field),
        right: (pinnedColumns.right || []).filter((column) => column !== field),
      });
    },
    [apiRef, pinnedColumns.left, pinnedColumns.right],
  );

  const getPinnedColumns = React.useCallback<GridColumnPinningApi['getPinnedColumns']>(() => {
    return gridPinnedColumnsSelector(apiRef.current.state);
  }, [apiRef]);

  const setPinnedColumns = React.useCallback<GridColumnPinningApi['setPinnedColumns']>(
    (newPinnedColumns) => {
      setState(apiRef, newPinnedColumns);
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const isColumnPinned = React.useCallback<GridColumnPinningApi['isColumnPinned']>(
    (field) => {
      const leftPinnedColumns = pinnedColumns.left || [];
      if (leftPinnedColumns.includes(field)) {
        return GridPinnedColumnPosition.LEFT;
      }
      const rightPinnedColumns = pinnedColumns.right || [];
      if (rightPinnedColumns.includes(field)) {
        return GridPinnedColumnPosition.RIGHT;
      }
      return false;
    },
    [pinnedColumns.left, pinnedColumns.right],
  );

  const columnPinningApi: GridColumnPinningApi = {
    pinColumn,
    unpinColumn,
    getPinnedColumns,
    setPinnedColumns,
    isColumnPinned,
  };

  useGridApiMethod(apiRef, columnPinningApi, 'public');

  const handleColumnOrderChange: GridEventListener<'columnOrderChange'> = (params) => {
    if (!apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns) {
      return;
    }

    const { column, targetIndex, oldIndex } = params;
    const delta = targetIndex > oldIndex ? 1 : -1;

    const latestColumnFields = gridColumnFieldsSelector(apiRef);

    /**
     * When a column X is reordered to somewhere else, the position where this column X is dropped
     * on must be moved to left or right to make room for it. The ^^^ below represents the column
     * which gave space to receive X.
     *
     * | X | B | C | D | -> | B | C | D | X | (for example X moved to after D, so delta=1)
     *              ^^^              ^^^
     *
     * | A | B | C | X | -> | X | A | B | C | (for example X moved before A, so delta=-1)
     *  ^^^                      ^^^
     *
     * If column P is pinned, it will not move to provide space. However, it will jump to the next
     * non-pinned column.
     *
     * | X | B | P | D | -> | B | D | P | X | (for example X moved to after D, with P pinned)
     *              ^^^          ^^^
     */
    const siblingField = latestColumnFields[targetIndex - delta];

    const newOrderedFieldsBeforePinningColumns = [
      ...apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns,
    ];

    // The index to start swapping fields
    let i = newOrderedFieldsBeforePinningColumns.findIndex(
      (currentColumn) => currentColumn === column.field,
    );
    // The index of the field to swap with
    let j = i + delta;

    // When to stop swapping fields.
    // We stop one field before because the swap is done with i + 1 (if delta=1)
    const stop = newOrderedFieldsBeforePinningColumns.findIndex(
      (currentColumn) => currentColumn === siblingField,
    );

    while (delta > 0 ? i < stop : i > stop) {
      // If the field to swap with is a pinned column, jump to the next
      while (apiRef.current.isColumnPinned(newOrderedFieldsBeforePinningColumns[j])) {
        j += delta;
      }

      const temp = newOrderedFieldsBeforePinningColumns[i];
      newOrderedFieldsBeforePinningColumns[i] = newOrderedFieldsBeforePinningColumns[j];
      newOrderedFieldsBeforePinningColumns[j] = temp;

      i = j;
      j = i + delta;
    }

    apiRef.current.caches.columnPinning.orderedFieldsBeforePinningColumns =
      newOrderedFieldsBeforePinningColumns;
  };

  useGridApiEventHandler(apiRef, 'columnOrderChange', handleColumnOrderChange);

  React.useEffect(() => {
    if (props.pinnedColumns) {
      apiRef.current.setPinnedColumns(props.pinnedColumns);
    }
  }, [apiRef, props.pinnedColumns]);
};

function setState(
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  model: GridPinnedColumnFields,
) {
  apiRef.current.setState((state) => ({
    ...state,
    pinnedColumns: model,
  }));
}
