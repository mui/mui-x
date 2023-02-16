import * as React from 'react';
import {
  GridColDef,
  gridFocusCellSelector,
  GridSignature,
  GridSingleSelectColDef,
  GridValidRowModel,
  gridVisibleColumnFieldsSelector,
  useGridNativeEventListener,
} from '@mui/x-data-grid';
import { getVisibleRows } from '@mui/x-data-grid/internals';
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

export const useGridClipboardImport = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'pagination' | 'paginationMode' | 'signature'>,
): void => {
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

      let rowsData = text.split('\n');

      if (rowsData.length > 1 && props.signature === GridSignature.DataGrid) {
        // limit paste to a single row in DataGrid
        rowsData = [rowsData[0]];
      }

      const isSingleValuePasted = rowsData.length === 1 && rowsData[0].indexOf('\t') === -1;

      const cellSelectionModel = apiRef.current.unstable_getCellSelectionModel();

      if (isSingleValuePasted) {
        const cellSelectionModelKeys = Object.keys(cellSelectionModel);

        if (cellSelectionModel && cellSelectionModelKeys.length > 0) {
          const rowUpdates: GridValidRowModel[] = [];
          cellSelectionModelKeys.forEach((rowId) => {
            const row: GridValidRowModel = { id: rowId };
            Object.keys(cellSelectionModel[rowId]).forEach((field) => {
              const colDef = apiRef.current.getColumn(field);
              const parsedValue = parseCellStringValue(rowsData[0], colDef);
              row[field] = parsedValue;
            });
            rowUpdates.push(row);
          });
          apiRef.current.updateRows(rowUpdates);
          return;
        }
      }

      if (cellSelectionModel && Object.keys(cellSelectionModel).length > 1) {
        // Multiple values are pasted starting from the first and top-most cell in the selection.
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

      const rowsToUpdate: GridValidRowModel[] = [];
      rowsData.forEach((rowData, index) => {
        const parsedData = rowData.split('\t');
        const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
        const targetRow = visibleRows.rows[selectedRowIndex + index];

        if (!targetRow) {
          return;
        }

        // TODO: `id` field isn't gonna work with `getRowId`
        const newRow: GridValidRowModel = { id: targetRow.id };
        const selectedFieldIndex = visibleColumnFields.indexOf(selectedCell.field);
        for (let i = selectedFieldIndex; i < visibleColumnFields.length; i += 1) {
          const field = visibleColumnFields[i];
          const stringValue = parsedData[i - selectedFieldIndex];
          if (typeof stringValue !== 'undefined') {
            const colDef = apiRef.current.getColumn(field);
            const parsedValue = parseCellStringValue(stringValue, colDef);
            newRow[field] = parsedValue;
          }
        }

        rowsToUpdate.push(newRow);
      });

      apiRef.current.updateRows(rowsToUpdate);
    },
    [apiRef, props.pagination, props.paginationMode, props.signature],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handlePaste);
};
