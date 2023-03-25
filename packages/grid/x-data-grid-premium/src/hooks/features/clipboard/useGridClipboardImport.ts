import * as React from 'react';
import type {
  GridColDef,
  GridRowId,
  GridSingleSelectColDef,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  gridFocusCellSelector,
  gridVisibleColumnFieldsSelector,
  useGridNativeEventListener,
} from '@mui/x-data-grid';
import { getRowIdFromRowModel, getVisibleRows } from '@mui/x-data-grid/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

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
      return JSON.parse(value);
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

  apiRef: React.MutableRefObject<GridPrivateApiPremium>;

  onRowPaste: DataGridPremiumProcessedProps['onRowPaste'];

  getRowId: DataGridPremiumProcessedProps['getRowId'];

  constructor({
    apiRef,
    onRowPaste,
    getRowId,
  }: {
    apiRef: React.MutableRefObject<GridPrivateApiPremium>;
    onRowPaste: DataGridPremiumProcessedProps['onRowPaste'];
    getRowId: DataGridPremiumProcessedProps['getRowId'];
  }) {
    this.apiRef = apiRef;
    this.onRowPaste = onRowPaste;
    this.getRowId = getRowId;
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
    const apiRef = this.apiRef;
    const colDef = apiRef.current.getColumn(field);
    if (!colDef) {
      return;
    }
    if (pastedCellValue === undefined) {
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
    const rowCopy = { ...row };
    rowCopy[field] = parsedValue;
    const newRowId = getRowIdFromRowModel(rowCopy, this.getRowId);
    if (String(newRowId) !== String(rowId)) {
      // We cannot update row id, so this cell value update should be ignored
      return;
    }
    this.rowsToUpdate[rowId] = rowCopy;
  }

  applyUpdates() {
    const apiRef = this.apiRef;
    const rowsToUpdate = this.rowsToUpdate;
    const rowsToUpdateArr: GridValidRowModel[] = [];
    const onRowPastePayload: Parameters<NonNullable<typeof this.onRowPaste>>[] = [];
    Object.keys(rowsToUpdate).forEach((rowId) => {
      const newRow = rowsToUpdate[rowId];
      rowsToUpdateArr.push(rowsToUpdate[rowId]);
      const oldRow = apiRef.current.getRow(rowId);
      onRowPastePayload.push([newRow, oldRow]);
    });
    apiRef.current.updateRows(rowsToUpdateArr);

    // call onRowPaste with the new and old rows
    onRowPastePayload.forEach((payload) => {
      if (typeof this.onRowPaste === 'function') {
        this.onRowPaste(...payload);
      }
    });
  }
}

export const useGridClipboardImport = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'pagination' | 'paginationMode' | 'onRowPaste' | 'getRowId'
  >,
): void => {
  const onRowPaste = props.onRowPaste;
  const getRowId = props.getRowId;

  const handlePaste = React.useCallback(
    async (event: KeyboardEvent) => {
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

      // Do not enter cell edit mode on paste
      event.stopPropagation();

      const text = await navigator.clipboard.readText();
      if (!text) {
        return;
      }

      const rowsData = text.split('\r\n');

      const isSingleValuePasted = rowsData.length === 1 && rowsData[0].indexOf('\t') === -1;

      const cellSelectionModel = apiRef.current.unstable_getCellSelectionModel();
      const cellSelectionModelKeys = Object.keys(cellSelectionModel);

      if (cellSelectionModel && cellSelectionModelKeys.length > 0) {
        const cellUpdater = new CellValueUpdater({ apiRef, onRowPaste, getRowId });

        cellSelectionModelKeys.forEach((rowId, rowIndex) => {
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

      const selectedRows = apiRef.current.getSelectedRows();

      if (selectedRows.size === 1) {
        // Multiple values are pasted starting from the focused cell
        // return;
      }

      if (selectedRows.size > 1) {
        // Multiple values are pasted starting from the first and top-most cell
      }

      const selectedCell = gridFocusCellSelector(apiRef);
      if (!selectedCell || !selectedCell.id || !selectedCell.field) {
        return;
      }

      const selectedRowId = selectedCell.id;
      const selectedRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(selectedRowId);
      const visibleRows = getVisibleRows(apiRef, {
        pagination: props.pagination,
        paginationMode: props.paginationMode,
      });

      const cellUpdater = new CellValueUpdater({ apiRef, onRowPaste, getRowId });

      rowsData.forEach((rowData, index) => {
        const parsedData = rowData.split('\t');
        const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
        const targetRow = visibleRows.rows[selectedRowIndex + index];

        if (!targetRow) {
          return;
        }

        const rowId = targetRow.id;
        const selectedFieldIndex = visibleColumnFields.indexOf(selectedCell.field);
        for (let i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
          const field = visibleColumnFields[i];
          const stringValue = parsedData[i - selectedFieldIndex];
          cellUpdater.updateCell({ rowId, field, pastedCellValue: stringValue });
        }
      });

      cellUpdater.applyUpdates();
    },
    [apiRef, props.pagination, props.paginationMode, onRowPaste, getRowId],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handlePaste);
};
