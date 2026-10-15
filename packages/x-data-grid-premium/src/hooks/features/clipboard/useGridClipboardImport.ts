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
} from '@mui/x-data-grid/internals';
import type { GridPipeProcessor, GridStateColDef } from '@mui/x-data-grid/internals';
import { errorOnce, warnOnce } from '@mui/x-internals/warning';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD, GRID_REORDER_COL_DEF } from '@mui/x-data-grid-pro';
import debounce from '@mui/utils/debounce';
import type { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

const columnFieldsToExcludeFromPaste = [
  GRID_CHECKBOX_SELECTION_FIELD,
  GRID_REORDER_COL_DEF.field,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
];

// Batches rows that are updated during clipboard paste to reduce `updateRows` calls
function batchRowUpdates<R>(func: (rows: R[]) => void, wait?: number) {
  let rows: R[] = [];

  const applyRows = () => {
    if (rows.length === 0) {
      return;
    }
    const rowsToApply = rows;
    rows = [];
    func(rowsToApply);
  };

  const debounced = debounce(applyRows, wait);

  return {
    push: (row: R) => {
      rows.push(row);
      debounced();
    },
    flush: () => {
      debounced.clear();
      applyRows();
    },
  };
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

  declare rowUpdates: ReturnType<typeof batchRowUpdates<GridRowModel>>;

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
    this.rowUpdates = batchRowUpdates(options.apiRef.current.updateRows, 50);
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
    const row = this.rowsToUpdate.get(rowId) || {
      ...(this.rowsToCreate.get(rowId) ?? apiRef.current.getRow(rowId)),
    };

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

  applyUpdates() {
    const { apiRef, processRowUpdate, onProcessRowUpdateError } = this.options;
    const rowsToUpdate = this.rowsToUpdate;
    const rowIdsToUpdate = Array.from(rowsToUpdate.keys());

    if (rowIdsToUpdate.length === 0) {
      apiRef.current.publishEvent('clipboardPasteEnd', {
        oldRows: new Map<GridRowId, GridValidRowModel>(),
        newRows: new Map<GridRowId, GridValidRowModel>(),
        createdRows: new Map<GridRowId, GridValidRowModel>(),
      });
      return;
    }

    const oldRows = new Map<GridRowId, GridValidRowModel>();
    const newRows = new Map<GridRowId, GridValidRowModel>();
    // The final rows to create, by the id that the paste gave to `processRowUpdate()`
    const rowsToInsert = new Map<GridRowId, GridValidRowModel>();

    const handleRowUpdate = async (rowId: GridRowId) => {
      const rowToCreate = this.rowsToCreate.get(rowId);
      const oldRow = rowToCreate ?? apiRef.current.getRow(rowId)!;
      const newRow = rowsToUpdate.get(rowId)!;
      if (!rowToCreate) {
        oldRows.set(rowId, oldRow);
      }

      const applyRowUpdate = (rowUpdate: GridRowModel | GridRowModelReplace) => {
        // A `{ _action: 'replace', row }` update is unwrapped so that the
        // `clipboardPasteEnd` event exposes the stored row, not the envelope.
        const row = isReplaceUpdate(rowUpdate) ? getReplaceRow(rowUpdate) : rowUpdate;
        if (rowToCreate) {
          // The rows are inserted after all updates are done, to keep the order of the paste
          rowsToInsert.set(rowId, row);
          return;
        }
        newRows.set(rowId, row);
        this.rowUpdates.push(rowUpdate);
      };

      if (typeof processRowUpdate === 'function') {
        const handleError = (errorThrown: any) => {
          if (onProcessRowUpdateError) {
            onProcessRowUpdateError(errorThrown);
          } else if (process.env.NODE_ENV !== 'production') {
            errorOnce(
              [
                'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
                'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
                'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
              ].join('\n'),
            );
          }
        };

        try {
          applyRowUpdate(await processRowUpdate(newRow, oldRow, { rowId }));
        } catch (error) {
          handleError(error);
        }
      } else {
        applyRowUpdate(newRow);
      }
    };

    const promises = rowIdsToUpdate.map((rowId) => {
      // Wrap in promise that always resolves to avoid Promise.all from stopping on first error.
      // This is to avoid using `Promise.allSettled` that has worse browser support.
      return new Promise((resolve) => {
        handleRowUpdate(rowId).then(resolve).catch(resolve);
      });
    });
    Promise.all(promises).then(() => {
      const createdRows = new Map<GridRowId, GridValidRowModel>();
      rowIdsToUpdate.forEach((rowId) => {
        const row = rowsToInsert.get(rowId);
        if (!row) {
          return;
        }
        // `processRowUpdate()` can give the new row its final id, for example one from the server
        const finalRowId = getRowIdFromRowModel(row, this.options.getRowId);
        if (apiRef.current.getRow(finalRowId) !== null || createdRows.has(finalRowId)) {
          warnOnce(
            [
              `MUI X: The pasted row with id "${finalRowId}" was not added, because its id is not unique.`,
              'Make sure that `processRowUpdate()` returns the new rows with ids that are not used by other rows.',
            ].join('\n'),
          );
          return;
        }
        createdRows.set(finalRowId, row);
        this.rowUpdates.push(row);
      });

      // Apply the pending rows before `clipboardPasteEnd`, so that its listeners (for example,
      // the undo/redo history) see the grid with the pasted values.
      this.rowUpdates.flush();
      apiRef.current.publishEvent('clipboardPasteEnd', {
        oldRows,
        newRows,
        createdRows,
      });
      this.rowsToUpdate.clear();
      this.rowsToCreate.clear();
    });
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

/**
 * Returns the rows that a paste from a cell can write into, and the index of the row where it starts.
 */
function getPasteTargetRows(
  apiRef: RefObject<GridApiPremium>,
  rowId: GridRowId,
  pagination: DataGridPremiumProcessedProps['pagination'],
  paginationMode: DataGridPremiumProcessedProps['paginationMode'],
) {
  const allRowIds = gridExpandedSortedRowIdsSelector(apiRef);
  const rowIds =
    pagination && paginationMode === 'client'
      ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef)
      : allRowIds;

  return {
    rowIds,
    startIndex: apiRef.current.getRowIndexRelativeToVisibleRows(rowId) as number | undefined,
    // The paste can add rows after the last row of the grid, but not after the last row of other pages
    canAddRows: rowIds.length > 0 && rowIds[rowIds.length - 1] === allRowIds[allRowIds.length - 1],
  };
}

/**
 * Returns the pasted data that goes past the last row of the grid.
 */
function getDataForRowsToCreate({
  pastedData,
  apiRef,
  pagination,
  paginationMode,
}: {
  pastedData: string[][];
  apiRef: RefObject<GridApiPremium>;
  pagination: DataGridPremiumProcessedProps['pagination'];
  paginationMode: DataGridPremiumProcessedProps['paginationMode'];
}): string[][] {
  const startCell = getPasteStartCell(apiRef, pastedData);
  if (!startCell) {
    return [];
  }

  const { rowIds, startIndex, canAddRows } = getPasteTargetRows(
    apiRef,
    startCell.id,
    pagination,
    paginationMode,
  );
  if (!canAddRows || startIndex === undefined) {
    return [];
  }

  return pastedData.slice(rowIds.length - startIndex);
}

function defaultPasteResolver({
  pastedData,
  apiRef,
  updateCell,
  pagination,
  paginationMode,
  rowIdsToCreate,
}: {
  pastedData: string[][];
  apiRef: RefObject<GridApiPremium>;
  updateCell: CellValueUpdater['updateCell'];
  pagination: DataGridPremiumProcessedProps['pagination'];
  paginationMode: DataGridPremiumProcessedProps['paginationMode'];
  /**
   * The rows that are not in the grid yet, for the pasted data that goes past the last row.
   */
  rowIdsToCreate: GridRowId[];
}) {
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

  const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef).filter((field) => {
    if (columnFieldsToExcludeFromPaste.includes(field)) {
      return false;
    }
    return true;
  });

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

  const selectedCell = getPasteStartCell(apiRef, pastedData);
  if (!selectedCell) {
    return;
  }

  const {
    rowIds: visibleRowIds,
    startIndex: selectedRowIndex,
    canAddRows,
  } = getPasteTargetRows(apiRef, selectedCell.id, pagination, paginationMode);
  if (selectedRowIndex === undefined) {
    return;
  }

  const selectedFieldIndex = visibleColumnFields.indexOf(selectedCell.field);
  const getRowId = (rowIndex: number): GridRowId | undefined => {
    if (rowIndex < visibleRowIds.length) {
      return visibleRowIds[rowIndex];
    }
    return canAddRows ? rowIdsToCreate[rowIndex - visibleRowIds.length] : undefined;
  };

  pastedData.forEach((rowData, index) => {
    const rowId = getRowId(selectedRowIndex + index);

    if (typeof rowId === 'undefined') {
      return;
    }

    for (let i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
      const field = visibleColumnFields[i];
      const stringValue = rowData[i - selectedFieldIndex];
      updateCell({ rowId, field, pastedCellValue: stringValue });
    }
  });
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
    async (pastedData: string[][], cellUpdater: CellValueUpdater): Promise<GridRowId[]> => {
      if (!createRows) {
        return [];
      }

      const data = getDataForRowsToCreate({
        pastedData,
        apiRef: getPublicApiRef(apiRef),
        pagination,
        paginationMode,
      });
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

      const rowIdsToCreate = await getRowIdsToCreate(pastedData, cellUpdater);

      apiRef.current.publishEvent('clipboardPasteStart', {
        data: pastedData,
      });

      defaultPasteResolver({
        pastedData,
        apiRef: getPublicApiRef(apiRef),
        updateCell: (...args) => {
          cellUpdater.updateCell(...args);
        },
        pagination,
        paginationMode,
        rowIdsToCreate,
      });

      cellUpdater.applyUpdates();
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
