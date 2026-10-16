'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import {
  GRID_CHECKBOX_SELECTION_FIELD,
  gridFocusCellSelector,
  gridVisibleColumnFieldsSelector,
  useGridEventPriority,
  useGridEvent,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridExpandedSortedRowIdsSelector,
  gridRowSelectionIdsSelector,
  gridRowSelectionCountSelector,
  gridRowMaximumTreeDepthSelector,
  GRID_ROOT_GROUP_ID,
  GridCellModes,
} from '@mui/x-data-grid';
import type {
  GridCellCoordinates,
  GridColDef,
  GridRowId,
  GridValidRowModel,
  GridRowModel,
  GridRowModelReplace,
  GridEventListener,
} from '@mui/x-data-grid';
import {
  getRowIdFromRowModel,
  getActiveElement,
  useGridRegisterPipeProcessor,
  getPublicApiRef,
  isPasteShortcut,
  useGridLogger,
  isEventTargetInPortal,
  isReplaceUpdate,
  getReplaceRow,
  gridPivotActiveSelector,
  mergeRowUpdate,
} from '@mui/x-data-grid/internals';
import type { GridPipeProcessor, GridStateColDef } from '@mui/x-data-grid/internals';
import { errorOnce, warnOnce } from '@mui/x-internals/warning';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD, GRID_REORDER_COL_DEF } from '@mui/x-data-grid-pro';
import type { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

const columnFieldsToExcludeFromPaste = [
  GRID_CHECKBOX_SELECTION_FIELD,
  GRID_REORDER_COL_DEF.field,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
];

const isPlainObject = (row: object) => {
  const proto = Object.getPrototypeOf(row);
  return proto === Object.prototype || proto === null;
};

/**
 * Applies the row updates of a paste in one `updateRows()` call.
 * The promise resolves when the rows are in the state, also when `throttleRowsMs` delays them.
 */
function applyRowUpdates(
  apiRef: RefObject<GridPrivateApiPremium>,
  updates: Array<GridRowModel | GridRowModelReplace>,
): Promise<void> {
  if (updates.length === 0) {
    return Promise.resolve();
  }

  const cacheBefore = apiRef.current.caches.rows;
  let isApplied = false;
  const unsubscribe = apiRef.current.subscribeEvent('rowsSet', () => {
    isApplied = true;
  });
  apiRef.current.updateRows(updates);
  unsubscribe();

  // The rows cache changed, but the state did not: `throttleRowsMs` delays the update
  if (isApplied || apiRef.current.caches.rows === cacheBefore) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const unsubscribeRowsSet = apiRef.current.subscribeEvent('rowsSet', () => {
      unsubscribeRowsSet();
      resolve();
    });
  });
}

async function getTextFromClipboard(rootEl: HTMLElement) {
  return new Promise<string>((resolve) => {
    const focusedCell = getActiveElement(document);

    const el = document.createElement('input');
    el.style.width = '0px';
    el.style.height = '0px';
    el.style.border = 'none';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.outline = 'none';
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '0';

    const handlePasteEvent = (event: ClipboardEvent) => {
      el.removeEventListener('paste', handlePasteEvent);
      const text = event.clipboardData?.getData('text/plain');
      if (focusedCell instanceof HTMLElement) {
        focusedCell.focus({ preventScroll: true });
      }
      el.remove();
      resolve(text || '');
    };

    el.addEventListener('paste', handlePasteEvent);
    rootEl.appendChild(el);
    el.focus({ preventScroll: true });
  });
}

// Keeps track of updated rows during clipboard paste
export class CellValueUpdater {
  rowsToUpdate: Map<GridRowId, GridValidRowModel> = new Map();

  declare options: {
    apiRef: RefObject<GridPrivateApiPremium>;
    processRowUpdate: DataGridPremiumProcessedProps['processRowUpdate'];
    onProcessRowUpdateError: DataGridPremiumProcessedProps['onProcessRowUpdateError'];
    getRowId: DataGridPremiumProcessedProps['getRowId'];
  };

  /**
   * The rows that the paste can add to the grid, as `clipboardPasteOptions.createRows()` returned them.
   * The paste adds a row only if it writes at least one value into it.
   */
  rowsToCreate: Map<GridRowId, GridValidRowModel> = new Map();

  constructor(options: CellValueUpdater['options']) {
    this.options = options;
  }

  /**
   * Registers rows that are not in the grid yet, so that the paste can write values into them.
   * @returns {GridRowId[]} The ids of the registered rows.
   */
  addRowsToCreate(rows: GridValidRowModel[]): GridRowId[] {
    const { apiRef, getRowId } = this.options;
    const rowIds: GridRowId[] = [];

    rows.forEach((row) => {
      const rowId = getRowIdFromRowModel(row, getRowId);
      if (apiRef.current.getRow(rowId) !== null || this.rowsToCreate.has(rowId)) {
        warnOnce(
          [
            `MUI X: The row with id "${rowId}" returned by \`clipboardPasteOptions.createRows()\` was ignored, because its id is not unique.`,
            'Return rows with ids that are not used by other rows.',
          ].join('\n'),
        );
        return;
      }
      this.rowsToCreate.set(rowId, row);
      rowIds.push(rowId);
    });

    return rowIds;
  }

  private getCellParams(rowId: GridRowId, colDef: GridStateColDef) {
    const { apiRef } = this.options;
    const rowToCreate = this.rowsToCreate.get(rowId);
    if (!rowToCreate) {
      return apiRef.current.getCellParams(rowId, colDef.field);
    }

    // `getCellParams()` requires a row that is in the grid
    return apiRef.current.getCellParamsForRow(rowId, colDef.field, rowToCreate, {
      colDef,
      rowNode: {
        type: 'leaf',
        id: rowId,
        depth: 0,
        parent: GRID_ROOT_GROUP_ID,
        groupingKey: null,
      },
      cellMode: GridCellModes.View,
      hasFocus: false,
      tabIndex: -1,
    });
  }

  updateCell({
    rowId,
    field,
    pastedCellValue,
  }: {
    rowId: GridRowId;
    field: GridColDef['field'];
    pastedCellValue: string;
  }) {
    if (pastedCellValue === undefined) {
      return;
    }

    const { apiRef, getRowId } = this.options;
    const colDef = apiRef.current.getColumn(field);
    if (!colDef || !colDef.editable) {
      return;
    }
    const rowBeforePaste = this.rowsToCreate.get(rowId) ?? apiRef.current.getRow(rowId);
    if (!rowBeforePaste) {
      // The row was removed while the paste was waiting, for example for `createRows()`
      return;
    }
    const row = this.rowsToUpdate.get(rowId) || { ...rowBeforePaste };

    // Check if the cell is editable using the API method, which respects the isCellEditable prop
    const cellParams = this.getCellParams(rowId, colDef);
    if (!apiRef.current.isCellEditable(cellParams)) {
      return;
    }

    let parsedValue = pastedCellValue;

    if (colDef.pastedValueParser) {
      parsedValue = colDef.pastedValueParser(pastedCellValue, row, colDef, apiRef);
    } else if (colDef.valueParser) {
      parsedValue = colDef.valueParser(parsedValue, row, colDef, apiRef);
    }

    if (parsedValue === undefined) {
      return;
    }

    let rowCopy = { ...row };
    if (typeof colDef.valueSetter === 'function') {
      rowCopy = colDef.valueSetter(parsedValue, rowCopy, colDef, apiRef);
    } else {
      rowCopy[field] = parsedValue;
    }
    const newRowId = getRowIdFromRowModel(rowCopy, getRowId);
    if (String(newRowId) !== String(rowId)) {
      // We cannot update row id, so this cell value update should be ignored
      return;
    }
    this.rowsToUpdate.set(rowId, rowCopy);
  }

  /**
   * Persists the updated rows, applies them to the grid, and fires `clipboardPasteEnd`.
   * @returns {Promise<void>} Resolves after `clipboardPasteEnd` is fired.
   */
  async applyUpdates(): Promise<void> {
    const { apiRef, processRowUpdate, onProcessRowUpdateError, getRowId } = this.options;
    const rowsToUpdate = this.rowsToUpdate;
    const rowIdsToUpdate = Array.from(rowsToUpdate.keys());

    const oldRows = new Map<GridRowId, GridValidRowModel>();
    const newRows = new Map<GridRowId, GridValidRowModel>();
    const createdRows = new Map<GridRowId, GridValidRowModel>();
    // The final updates, by the id of the row that the paste updated or created
    const finalUpdates = new Map<GridRowId, GridRowModel | GridRowModelReplace>();

    const handleRowUpdate = async (rowId: GridRowId) => {
      const rowToCreate = this.rowsToCreate.get(rowId);
      const oldRow = rowToCreate ?? apiRef.current.getRow(rowId)!;
      const newRow = rowsToUpdate.get(rowId)!;
      if (!rowToCreate) {
        oldRows.set(rowId, oldRow);
      }

      let rowUpdate: GridRowModel | GridRowModelReplace = newRow;
      if (typeof processRowUpdate === 'function') {
        try {
          rowUpdate = await processRowUpdate(newRow, oldRow, { rowId });
        } catch (error) {
          if (onProcessRowUpdateError) {
            onProcessRowUpdateError(error);
          } else if (process.env.NODE_ENV !== 'production') {
            errorOnce(
              [
                'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
                'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
                'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
              ].join('\n'),
            );
          }
          return;
        }
      }

      if (!rowToCreate) {
        // A `{ _action: 'replace', row }` update is unwrapped so that the
        // `clipboardPasteEnd` event exposes the stored row, not the envelope.
        newRows.set(rowId, isReplaceUpdate(rowUpdate) ? getReplaceRow(rowUpdate) : rowUpdate);
        finalUpdates.set(rowId, rowUpdate);
        return;
      }

      let row = isReplaceUpdate(rowUpdate) ? getReplaceRow(rowUpdate) : rowUpdate;
      // eslint-disable-next-line no-underscore-dangle
      if (row._action === 'delete') {
        // `processRowUpdate()` does not want the row
        return;
      }
      if (!isPlainObject(rowToCreate) && isPlainObject(row)) {
        // Keep the prototype of a row that `createRows()` returned as a class instance
        row = mergeRowUpdate(rowToCreate, row);
      }
      finalUpdates.set(rowId, row);
    };

    await Promise.all(
      // `handleRowUpdate()` handles the errors, so a rejected update does not stop the others
      rowIdsToUpdate.map((rowId) => handleRowUpdate(rowId)),
    );

    // Keep the order of the paste for the created rows
    const updates: Array<GridRowModel | GridRowModelReplace> = [];
    rowIdsToUpdate.forEach((rowId) => {
      const update = finalUpdates.get(rowId);
      if (!update) {
        return;
      }
      if (!this.rowsToCreate.has(rowId)) {
        updates.push(update);
        return;
      }

      // `processRowUpdate()` can give the new row its final id, for example one from the server
      const finalRowId = getRowIdFromRowModel(update, getRowId);
      if (apiRef.current.getRow(finalRowId) !== null || createdRows.has(finalRowId)) {
        warnOnce(
          [
            `MUI X: The pasted row with id "${finalRowId}" was not added, because its id is not unique.`,
            'Make sure that `processRowUpdate()` returns the new rows with ids that are not used by other rows.',
          ].join('\n'),
        );
        return;
      }
      createdRows.set(finalRowId, update);
      updates.push(update);
    });

    // Apply the rows before `clipboardPasteEnd`, so that its listeners (for example,
    // the undo/redo history) see the grid with the pasted values.
    await applyRowUpdates(apiRef, updates);
    apiRef.current.publishEvent('clipboardPasteEnd', { oldRows, newRows, createdRows });
    this.rowsToUpdate.clear();
    this.rowsToCreate.clear();
  }
}

/**
 * Returns the cell where the paste starts, when the paste does not target a cell range or selected rows.
 */
function getPasteStartCell(
  apiRef: RefObject<GridApiPremium>,
  pastedData: string[][],
): GridCellCoordinates | null {
  const isSingleValuePasted = pastedData.length === 1 && pastedData[0].length === 1;
  const selectedCellsArray = apiRef.current.getSelectedCellsAsArray();
  if (apiRef.current.getCellSelectionModel() && selectedCellsArray.length > 1) {
    return null;
  }
  if (gridRowSelectionCountSelector(apiRef) > 0 && !isSingleValuePasted) {
    return null;
  }

  let selectedCell = gridFocusCellSelector(apiRef);
  if (!selectedCell && selectedCellsArray.length === 1) {
    selectedCell = selectedCellsArray[0];
  }

  if (!selectedCell || columnFieldsToExcludeFromPaste.includes(selectedCell.field)) {
    return null;
  }
  return selectedCell;
}

interface GridCellPasteTarget {
  /**
   * The cell where the paste starts.
   */
  cell: GridCellCoordinates;
  /**
   * The rows that the paste can write into.
   */
  rowIds: GridRowId[];
  /**
   * The index of the row of `cell` in `rowIds`.
   */
  startIndex: number;
  /**
   * If `true`, `rowIds` ends with the last row of the grid, so the paste can add rows after it.
   * It is `false` on the pages before the last page.
   */
  canAddRows: boolean;
}

/**
 * Returns the target of a paste that starts from a cell, or `null` if the paste targets a cell range or selected rows.
 */
function getCellPasteTarget({
  pastedData,
  apiRef,
  pagination,
  paginationMode,
}: {
  pastedData: string[][];
  apiRef: RefObject<GridApiPremium>;
  pagination: DataGridPremiumProcessedProps['pagination'];
  paginationMode: DataGridPremiumProcessedProps['paginationMode'];
}): GridCellPasteTarget | null {
  const cell = getPasteStartCell(apiRef, pastedData);
  if (!cell) {
    return null;
  }

  const startIndex = apiRef.current.getRowIndexRelativeToVisibleRows(cell.id) as number | undefined;
  if (startIndex === undefined) {
    return null;
  }

  const allRowIds = gridExpandedSortedRowIdsSelector(apiRef);
  const rowIds =
    pagination && paginationMode === 'client'
      ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef)
      : allRowIds;

  return {
    cell,
    rowIds,
    startIndex,
    canAddRows: rowIds.length > 0 && rowIds[rowIds.length - 1] === allRowIds[allRowIds.length - 1],
  };
}

/**
 * Returns the pasted data that goes past the last row of the grid.
 */
function getDataForRowsToCreate(
  pastedData: string[][],
  cellTarget: GridCellPasteTarget | null,
): string[][] {
  if (!cellTarget?.canAddRows) {
    return [];
  }
  return pastedData.slice(cellTarget.rowIds.length - cellTarget.startIndex);
}

function defaultPasteResolver({
  pastedData,
  apiRef,
  updateCell,
  cellTarget,
  rowIdsToCreate,
}: {
  pastedData: string[][];
  apiRef: RefObject<GridApiPremium>;
  updateCell: CellValueUpdater['updateCell'];
  /**
   * The target of a paste that starts from a cell.
   * It is read when the paste starts, because the focus can move while `createRows()` runs.
   */
  cellTarget: GridCellPasteTarget | null;
  /**
   * The rows that are not in the grid yet, for the pasted data that goes past the last row.
   */
  rowIdsToCreate: GridRowId[];
}) {
  const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef).filter((field) => {
    if (columnFieldsToExcludeFromPaste.includes(field)) {
      return false;
    }
    return true;
  });

  if (cellTarget) {
    const { cell, rowIds, startIndex, canAddRows } = cellTarget;
    const getRowId = (rowIndex: number): GridRowId | undefined => {
      if (rowIndex < rowIds.length) {
        return rowIds[rowIndex];
      }
      return canAddRows ? rowIdsToCreate[rowIndex - rowIds.length] : undefined;
    };

    const selectedFieldIndex = visibleColumnFields.indexOf(cell.field);
    pastedData.forEach((rowData, index) => {
      const rowId = getRowId(startIndex + index);
      if (typeof rowId === 'undefined') {
        return;
      }

      for (let i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
        const field = visibleColumnFields[i];
        const stringValue = rowData[i - selectedFieldIndex];
        updateCell({ rowId, field, pastedCellValue: stringValue });
      }
    });
    return;
  }

  const isSingleValuePasted = pastedData.length === 1 && pastedData[0].length === 1;

  const cellSelectionModel = apiRef.current.getCellSelectionModel();
  const selectedCellsArray = apiRef.current.getSelectedCellsAsArray();
  if (cellSelectionModel && selectedCellsArray.length > 1) {
    let lastRowId = selectedCellsArray[0].id;
    let rowIndex = 0;
    let colIndex = 0;
    selectedCellsArray.forEach(({ id: rowId, field }) => {
      if (rowId !== lastRowId) {
        lastRowId = rowId;
        rowIndex += 1;
        colIndex = 0;
      }

      const rowDataArr = pastedData[isSingleValuePasted ? 0 : rowIndex];
      const hasRowData = isSingleValuePasted ? true : rowDataArr !== undefined;
      if (hasRowData) {
        const cellValue = isSingleValuePasted ? rowDataArr[0] : rowDataArr[colIndex];
        updateCell({ rowId, field, pastedCellValue: cellValue });
      }

      colIndex += 1;
    });

    return;
  }

  if (gridRowSelectionCountSelector(apiRef) > 0 && !isSingleValuePasted) {
    // Multiple values are pasted starting from the first and top-most cell
    const pastedRowsDataCount = pastedData.length;
    const selectedRows = gridRowSelectionIdsSelector(apiRef);

    // There's no guarantee that the selected rows are in the same order as the pasted rows
    selectedRows.forEach((row, rowId) => {
      let rowData: string[] | undefined;
      if (pastedRowsDataCount === 1) {
        // If only one row is pasted - paste it to all selected rows
        rowData = pastedData[0];
      } else {
        rowData = pastedData.shift();
      }

      if (rowData === undefined) {
        return;
      }

      rowData.forEach((newCellValue, cellIndex) => {
        updateCell({
          rowId,
          field: visibleColumnFields[cellIndex],
          pastedCellValue: newCellValue,
        });
      });
    });

    return;
  }
}

export const useGridClipboardImport = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'pagination'
    | 'paginationMode'
    | 'processRowUpdate'
    | 'onProcessRowUpdateError'
    | 'getRowId'
    | 'onClipboardPasteStart'
    | 'onClipboardPasteEnd'
    | 'splitClipboardPastedText'
    | 'disableClipboardPaste'
    | 'onBeforeClipboardPasteStart'
    | 'clipboardCopyCellDelimiter'
    | 'clipboardPasteOptions'
    | 'dataSource'
    | 'treeData'
  >,
): void => {
  const processRowUpdate = props.processRowUpdate;
  const onProcessRowUpdateError = props.onProcessRowUpdateError;
  const getRowId = props.getRowId;
  const enableClipboardPaste = !props.disableClipboardPaste;
  const logger = useGridLogger(apiRef, 'useGridClipboardImport');

  const {
    clipboardCopyCellDelimiter,
    splitClipboardPastedText,
    pagination,
    paginationMode,
    onBeforeClipboardPasteStart,
    dataSource,
    treeData,
  } = props;
  const createRows = props.clipboardPasteOptions?.createRows;

  const getRowIdsToCreate = React.useCallback(
    async (
      pastedData: string[][],
      cellTarget: GridCellPasteTarget | null,
      cellUpdater: CellValueUpdater,
    ): Promise<GridRowId[]> => {
      if (!createRows) {
        return [];
      }

      const data = getDataForRowsToCreate(pastedData, cellTarget);
      if (data.length === 0) {
        return [];
      }

      let unsupportedFeature: string | null = null;
      if (dataSource) {
        unsupportedFeature = 'the `dataSource` prop';
      } else if (pagination && paginationMode === 'server') {
        unsupportedFeature = 'server-side pagination';
      } else if (treeData || gridRowMaximumTreeDepthSelector(apiRef) > 1) {
        unsupportedFeature = 'tree data or row grouping';
      } else if (gridPivotActiveSelector(apiRef)) {
        unsupportedFeature = 'pivoting';
      }
      if (unsupportedFeature) {
        warnOnce(
          `MUI X: The paste did not add rows, because \`clipboardPasteOptions.createRows()\` is not supported with ${unsupportedFeature}.`,
        );
        return [];
      }

      let rows: GridValidRowModel[] = [];
      try {
        rows = await createRows({ count: data.length, data });
      } catch (error) {
        logger.debug('The paste did not add rows, because `createRows()` was rejected');
        return [];
      }
      if (!Array.isArray(rows)) {
        return [];
      }

      return cellUpdater.addRowsToCreate(rows.slice(0, data.length));
    },
    [apiRef, createRows, dataSource, treeData, pagination, paginationMode, logger],
  );

  // A paste waits for the previous paste, so that it sees the rows that the previous paste added
  const pasteQueueRef = React.useRef<Promise<void>>(Promise.resolve());

  const handlePaste = React.useCallback<GridEventListener<'cellKeyDown'>>(
    async (params, event) => {
      // Ignore portal
      // Do not apply shortcuts if the focus is not on the cell root component
      if (isEventTargetInPortal(event)) {
        return;
      }
      if (!enableClipboardPaste) {
        return;
      }
      if (!isPasteShortcut(event)) {
        return;
      }

      const focusedCell = gridFocusCellSelector(apiRef);
      if (focusedCell !== null) {
        const cellMode = apiRef.current.getCellMode(focusedCell.id, focusedCell.field);
        if (cellMode === 'edit') {
          // Do not paste data when the cell is in edit mode
          return;
        }
      }

      const rootEl = apiRef.current.rootElementRef?.current;
      if (!rootEl) {
        return;
      }

      const text = await getTextFromClipboard(rootEl);
      if (!text) {
        return;
      }

      const pastedData = splitClipboardPastedText(text, clipboardCopyCellDelimiter);
      if (!pastedData) {
        return;
      }

      // Only a paste that can add rows needs the previous paste to finish
      const previousPaste = createRows ? pasteQueueRef.current : Promise.resolve();
      let finishPaste = () => {};
      pasteQueueRef.current = new Promise<void>((resolve) => {
        finishPaste = resolve;
      });

      try {
        await previousPaste;

        if (onBeforeClipboardPasteStart) {
          try {
            await onBeforeClipboardPasteStart({ data: pastedData });
          } catch (error) {
            logger.debug('Clipboard paste operation cancelled');
            return;
          }
        }

        const cellUpdater = new CellValueUpdater({
          apiRef,
          processRowUpdate,
          onProcessRowUpdateError,
          getRowId,
        });

        // Read the target before `createRows()`, because the focus and the rows can change while it runs
        const cellTarget = getCellPasteTarget({
          pastedData,
          apiRef: getPublicApiRef(apiRef),
          pagination,
          paginationMode,
        });
        const rowIdsToCreate = await getRowIdsToCreate(pastedData, cellTarget, cellUpdater);

        apiRef.current.publishEvent('clipboardPasteStart', {
          data: pastedData,
        });

        defaultPasteResolver({
          pastedData,
          apiRef: getPublicApiRef(apiRef),
          updateCell: (...args) => {
            cellUpdater.updateCell(...args);
          },
          cellTarget,
          rowIdsToCreate,
        });

        await cellUpdater.applyUpdates();
      } finally {
        finishPaste();
      }
    },
    [
      apiRef,
      processRowUpdate,
      onProcessRowUpdateError,
      getRowId,
      enableClipboardPaste,
      splitClipboardPastedText,
      clipboardCopyCellDelimiter,
      pagination,
      paginationMode,
      onBeforeClipboardPasteStart,
      getRowIdsToCreate,
      createRows,
      logger,
    ],
  );

  const checkIfCanStartEditing = React.useCallback<GridPipeProcessor<'canStartEditing'>>(
    (initialValue, { event }) => {
      if (isPasteShortcut(event) && enableClipboardPaste) {
        // Do not enter cell edit mode on paste
        return false;
      }
      return initialValue;
    },
    [enableClipboardPaste],
  );

  useGridEvent(apiRef, 'cellKeyDown', handlePaste);

  useGridEventPriority(apiRef, 'clipboardPasteStart', props.onClipboardPasteStart);
  useGridEventPriority(apiRef, 'clipboardPasteEnd', props.onClipboardPasteEnd);

  useGridRegisterPipeProcessor(apiRef, 'canStartEditing', checkIfCanStartEditing);
};
