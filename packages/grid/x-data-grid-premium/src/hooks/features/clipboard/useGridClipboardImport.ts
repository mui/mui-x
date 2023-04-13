import * as React from 'react';
import {
  GridColDef,
  GridRowId,
  GridSingleSelectColDef,
  GridValidRowModel,
  GRID_CHECKBOX_SELECTION_FIELD,
  gridFocusCellSelector,
  gridVisibleColumnFieldsSelector,
  GridRowModel,
  useGridApiOptionHandler,
  useGridApiEventHandler,
  GridEventListener,
} from '@mui/x-data-grid';
import { buildWarning, getRowIdFromRowModel, getVisibleRows } from '@mui/x-data-grid/internals';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD, GRID_REORDER_COL_DEF } from '@mui/x-data-grid-pro';
import { unstable_debounce as debounce } from '@mui/utils';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

const missingOnProcessRowUpdateErrorWarning = buildWarning(
  [
    'MUI: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.',
    'To handle the error pass a callback to the `onProcessRowUpdateError` prop, e.g. `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
    'For more detail, see http://mui.com/components/data-grid/editing/#persistence.',
  ],
  'error',
);

const columnFieldsToExcludeFromPaste = [
  GRID_CHECKBOX_SELECTION_FIELD,
  GRID_REORDER_COL_DEF.field,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
];

// Batches rows that are updated during clipboard paste to reduce `updateRows` calls
function batchRowUpdates<R>(func: (rows: R[]) => void, wait?: number) {
  let rows: R[] = [];

  const debounced = debounce(() => {
    func(rows);
    rows = [];
  }, wait);

  return (row: R) => {
    rows.push(row);
    debounced();
  };
}

async function getTextFromClipboard(rootEl: HTMLElement) {
  return new Promise<string>((resolve) => {
    const focusedCell = document.activeElement;

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

const stringToBoolean = (value: string) => {
  switch (value.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'false':
    case 'no':
    case '0':
    case 'null':
    case 'undefined':
      return false;

    default:
      return undefined;
  }
};

const parseCellStringValue = (value: string, colDef: GridColDef) => {
  switch (colDef.type) {
    case 'number': {
      return Number(value);
    }
    case 'boolean': {
      return stringToBoolean(value);
    }
    case 'singleSelect': {
      const colDefValueOptions = (colDef as GridSingleSelectColDef).valueOptions;
      const valueOptions =
        typeof colDefValueOptions === 'function'
          ? colDefValueOptions({ field: colDef.field })
          : colDefValueOptions || [];
      const valueOption = valueOptions.find((option) => {
        if (option === value) {
          return true;
        }
        // TODO: would it work with valueFormatter?
        if (typeof option === 'object' && option !== null) {
          if (String(option.label) === value) {
            return true;
          }
        }
        return false;
      });
      if (valueOption) {
        return valueOption;
      }
      return value;
    }
    case 'date':
    case 'dateTime': {
      const date = new Date(value);
      return date;
    }
    default:
      return value;
  }
};

// Keeps track of updated rows during clipboard paste
class CellValueUpdater {
  rowsToUpdate: {
    [rowId: GridRowId]: GridValidRowModel;
  } = {};

  updateRow: (row: GridRowModel) => void;

  options: {
    apiRef: React.MutableRefObject<GridPrivateApiPremium>;
    processRowUpdate: DataGridPremiumProcessedProps['processRowUpdate'];
    onProcessRowUpdateError: DataGridPremiumProcessedProps['onProcessRowUpdateError'];
    getRowId: DataGridPremiumProcessedProps['getRowId'];
  };

  constructor(options: CellValueUpdater['options']) {
    this.options = options;
    this.updateRow = batchRowUpdates(options.apiRef.current.updateRows, 50);
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
    const row = this.rowsToUpdate[rowId] || { ...apiRef.current.getRow(rowId) };
    if (!row) {
      return;
    }

    const parsedValue = parseCellStringValue(pastedCellValue, colDef);
    if (parsedValue === undefined) {
      return;
    }

    let rowCopy = { ...row };
    if (typeof colDef.valueSetter === 'function') {
      rowCopy = colDef.valueSetter({ value: parsedValue, row: rowCopy });
    } else {
      rowCopy[field] = parsedValue;
    }
    const newRowId = getRowIdFromRowModel(rowCopy, getRowId);
    if (String(newRowId) !== String(rowId)) {
      // We cannot update row id, so this cell value update should be ignored
      return;
    }
    this.rowsToUpdate[rowId] = rowCopy;
  }

  applyUpdates() {
    const { apiRef, processRowUpdate, onProcessRowUpdateError } = this.options;
    const rowsToUpdate = this.rowsToUpdate;
    const rowIdsToUpdate = Object.keys(rowsToUpdate);

    if (rowIdsToUpdate.length === 0) {
      return;
    }

    apiRef.current.publishEvent('clipboardPasteStart');

    const handleRowUpdate = async (rowId: GridRowId) => {
      const newRow = rowsToUpdate[rowId];

      if (typeof processRowUpdate === 'function') {
        const handleError = (errorThrown: any) => {
          if (onProcessRowUpdateError) {
            onProcessRowUpdateError(errorThrown);
          } else {
            missingOnProcessRowUpdateErrorWarning();
          }
        };

        try {
          const oldRow = apiRef.current.getRow(rowId);
          const finalRowUpdate = await processRowUpdate(newRow, oldRow);
          this.updateRow(finalRowUpdate);
        } catch (error) {
          handleError(error);
        }
      } else {
        this.updateRow(newRow);
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
      this.rowsToUpdate = {};
      apiRef.current.publishEvent('clipboardPasteEnd');
    });
  }
}

export const useGridClipboardImport = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'pagination'
    | 'paginationMode'
    | 'processRowUpdate'
    | 'onProcessRowUpdateError'
    | 'getRowId'
    | 'unstable_enableClipboardPaste'
    | 'onClipboardPasteStart'
    | 'onClipboardPasteEnd'
  >,
): void => {
  const processRowUpdate = props.processRowUpdate;
  const onProcessRowUpdateError = props.onProcessRowUpdateError;
  const getRowId = props.getRowId;
  const enableClipboardPaste = props.unstable_enableClipboardPaste;
  const rootEl = apiRef.current.rootElementRef?.current;

  const handlePaste = React.useCallback<GridEventListener<'cellKeyDown'>>(
    async (params, event) => {
      if (!enableClipboardPaste) {
        return;
      }
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (String.fromCharCode(event.keyCode) !== 'V' || !isModifierKeyPressed) {
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

      if (!rootEl) {
        return;
      }

      // Do not enter cell edit mode on paste
      event.defaultMuiPrevented = true;

      const text = await getTextFromClipboard(rootEl);
      if (!text) {
        return;
      }

      const cellUpdater = new CellValueUpdater({
        apiRef,
        processRowUpdate,
        onProcessRowUpdateError,
        getRowId,
      });

      // support both \n and \r\n
      const rowsData = text.replace(/\r/g, '').split('\n');

      const isSingleValuePasted = rowsData.length === 1 && rowsData[0].indexOf('\t') === -1;

      const cellSelectionModel = apiRef.current.unstable_getCellSelectionModel();
      if (cellSelectionModel && apiRef.current.unstable_getSelectedCellsAsArray().length > 1) {
        Object.keys(cellSelectionModel).forEach((rowId, rowIndex) => {
          const rowDataString = rowsData[isSingleValuePasted ? 0 : rowIndex];
          const hasRowData = isSingleValuePasted ? true : rowDataString !== undefined;
          if (!hasRowData) {
            return;
          }
          const rowData = rowDataString.split('\t');
          Object.keys(cellSelectionModel[rowId]).forEach((field, colIndex) => {
            const cellValue = isSingleValuePasted ? rowsData[0] : rowData[colIndex];
            cellUpdater.updateCell({ rowId, field, pastedCellValue: cellValue });
          });
        });

        cellUpdater.applyUpdates();
        return;
      }

      const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef).filter((field) => {
        if (columnFieldsToExcludeFromPaste.includes(field)) {
          return false;
        }
        return true;
      });

      const selectedRows = apiRef.current.getSelectedRows();

      if (selectedRows.size > 0 && !isSingleValuePasted) {
        // Multiple values are pasted starting from the first and top-most cell
        const pastedRowsDataCount = rowsData.length;

        // There's no guarantee that the selected rows are in the same order as the pasted rows
        selectedRows.forEach((row, rowId) => {
          let rowData: string | undefined;
          if (pastedRowsDataCount === 1) {
            // If only one row is pasted - paste it to all selected rows
            rowData = rowsData[0];
          } else {
            rowData = rowsData.shift();
          }

          if (rowData === undefined) {
            return;
          }

          rowData.split('\t').forEach((newCellValue, cellIndex) => {
            cellUpdater.updateCell({
              rowId,
              field: visibleColumnFields[cellIndex],
              pastedCellValue: newCellValue,
            });
          });
        });

        cellUpdater.applyUpdates();
        return;
      }

      const selectedCell = gridFocusCellSelector(apiRef);
      if (!selectedCell) {
        return;
      }

      if (columnFieldsToExcludeFromPaste.includes(selectedCell.field)) {
        return;
      }

      const selectedRowId = selectedCell.id;
      const selectedRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(selectedRowId);
      const visibleRows = getVisibleRows(apiRef, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });

      const selectedFieldIndex = visibleColumnFields.indexOf(selectedCell.field);
      rowsData.forEach((rowData, index) => {
        const parsedData = rowData.split('\t');
        const targetRow = visibleRows.rows[selectedRowIndex + index];

        if (!targetRow) {
          return;
        }

        const rowId = targetRow.id;
        for (let i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
          const field = visibleColumnFields[i];
          const stringValue = parsedData[i - selectedFieldIndex];
          cellUpdater.updateCell({ rowId, field, pastedCellValue: stringValue });
        }
      });

      cellUpdater.applyUpdates();
    },
    [
      apiRef,
      props.pagination,
      props.paginationMode,
      processRowUpdate,
      onProcessRowUpdateError,
      getRowId,
      enableClipboardPaste,
      rootEl,
    ],
  );

  useGridApiEventHandler(apiRef, 'cellKeyDown', handlePaste);

  useGridApiOptionHandler(apiRef, 'clipboardPasteStart', props.onClipboardPasteStart);
  useGridApiOptionHandler(apiRef, 'clipboardPasteEnd', props.onClipboardPasteEnd);
};
