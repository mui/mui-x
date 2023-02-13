import * as React from 'react';
import {
  GridColDef,
  gridFocusCellSelector,
  GridRowId,
  GridSignature,
  GridSingleSelectColDef,
  GridValidRowModel,
  gridVisibleColumnFieldsSelector,
  useGridNativeEventListener,
} from '@mui/x-data-grid';
import {
  getVisibleRows,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
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
  const getCellSelectionModel = React.useCallback(() => {
    if (typeof apiRef.current.unstable_getCellSelectionModel === 'function') {
      const cellSelectionModel = apiRef.current.unstable_getCellSelectionModel();
      return cellSelectionModel;
    }
    return null;
  }, [apiRef]);

  const handlePaste = React.useCallback(
    async (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (String.fromCharCode(event.keyCode) !== 'V' || !isModifierKeyPressed) {
        return;
      }

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

      const cellSelectionModel = getCellSelectionModel();

      if (isSingleValuePasted) {
        if (cellSelectionModel && Object.keys(cellSelectionModel).length > 1) {
          // Single values are pasted to all selected cells in the range.
        } else {
          // Single values are pasted to the focused cell
        }
        // return;
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
    [apiRef, props.pagination, props.paginationMode, props.signature, getCellSelectionModel],
  );

  // TODO: move this to the GridColDef to make if configurable?
  const stringifyCellForClipboard = React.useCallback(
    (rowId: GridRowId, field: string) => {
      const cellParams = apiRef.current.getCellParams(rowId, field);
      let data: string;
      const columnType = cellParams.colDef.type;
      if (columnType === 'number') {
        data = String(cellParams.value);
      } else if (columnType === 'date' || columnType === 'dateTime') {
        data = (cellParams.value as Date)?.toString();
      } else {
        data = cellParams.formattedValue as any;
      }
      return data;
    },
    [apiRef],
  );

  const handleClipboardCopy = React.useCallback<GridPipeProcessor<'clipboardCopy'>>(
    (value) => {
      const cellSelectionModel = getCellSelectionModel();
      if (cellSelectionModel && Object.keys(cellSelectionModel).length > 1) {
        const copyData = Object.keys(cellSelectionModel).reduce((acc, rowId) => {
          const fieldsMap = cellSelectionModel[rowId];
          const rowString = Object.keys(fieldsMap).reduce((acc2, field) => {
            let cellData: string;
            if (fieldsMap[field]) {
              cellData = stringifyCellForClipboard(rowId, field);
            } else {
              cellData = '';
            }
            return acc2 ? [acc2, cellData].join('\t') : cellData;
          }, '');
          return acc ? [acc, rowString].join('\n') : rowString;
        }, '');
        return copyData;
      }

      return value;
    },
    [stringifyCellForClipboard, getCellSelectionModel],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handlePaste);

  useGridRegisterPipeProcessor(apiRef, 'clipboardCopy', handleClipboardCopy);
};
