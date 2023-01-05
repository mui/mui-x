import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridClipboardApi } from '../../../models/api';
import { GridSignature, useGridApiMethod, useGridNativeEventListener } from '../../utils';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { gridVisibleColumnFieldsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridValidRowModel } from '../../../models/gridRows';
import { GridColDef } from '../../../models/colDef/gridColDef';

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
  const columnType = colDef.type;

  switch (columnType) {
    case 'number': {
      return Number(value);
    }
    case 'boolean': {
      return stringToBoolean(value);
    }
    case 'singleSelect': {
      const valueOptions =
        typeof colDef.valueOptions === 'function'
          ? colDef.valueOptions({ field: colDef.field })
          : colDef.valueOptions || [];
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
    default:
      return value;
  }
};

function writeToClipboardPolyfill(data: string) {
  const span = document.createElement('span');
  span.style.whiteSpace = 'pre';
  span.style.userSelect = 'all';
  span.style.opacity = '0px';
  span.textContent = data;

  document.body.appendChild(span);

  const range = document.createRange();
  range.selectNode(span);
  const selection = window.getSelection();
  selection!.removeAllRanges();
  selection!.addRange(range);

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(span);
  }
}

function copyToClipboard(data: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(data).catch(() => {
      writeToClipboardPolyfill(data);
    });
  } else {
    writeToClipboardPolyfill(data);
  }
}

function hasNativeSelection(element: HTMLInputElement) {
  // When getSelection is called on an <iframe> that is not displayed Firefox will return null.
  if (window.getSelection()?.toString()) {
    return true;
  }

  // window.getSelection() returns an empty string in Firefox for selections inside a form element.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=85686.
  // Instead, we can use element.selectionStart that is only defined on form elements.
  if (element && (element.selectionEnd || 0) - (element.selectionStart || 0) > 0) {
    return true;
  }

  return false;
}

/**
 * @requires useGridCsvExport (method)
 * @requires useGridSelection (method)
 */
export const useGridClipboard = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode' | 'signature'>,
): void => {
  const copySelectedRowsToClipboard = React.useCallback<
    GridClipboardApi['unstable_copySelectedRowsToClipboard']
  >(() => {
    if (apiRef.current.getSelectedRows().size === 0) {
      return;
    }

    const data = apiRef.current.getDataAsCsv({
      includeHeaders: false,
      // TODO: make it configurable
      delimiter: '\t',
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(data).catch(() => {
        writeToClipboardPolyfill(data);
      });
    } else {
      writeToClipboardPolyfill(data);
    }
  }, [apiRef]);

  const copyFocusedCellToClipboard = React.useCallback<
    GridClipboardApi['unstable_copyFocusedCellToClipboard']
  >(() => {
    const focusedCell = gridFocusCellSelector(apiRef);
    if (!focusedCell) {
      return;
    }

    const cellParams = apiRef.current.getCellParams(focusedCell.id, focusedCell.field);
    let data: string;
    const columnType = cellParams.colDef.type;
    if (columnType === 'number') {
      data = String(cellParams.value);
    } else {
      data = cellParams.formattedValue;
    }
    copyToClipboard(data);
  }, [apiRef]);

  const handleCopy = React.useCallback(
    (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey;
      // event.code === 'KeyC' is not enough as event.code assume a QWERTY keyboard layout which would
      // be wrong with a Dvorak keyboard (as if pressing J).
      if (String.fromCharCode(event.keyCode) !== 'C' || !isModifierKeyPressed) {
        return;
      }

      // Do nothing if there's a native selection
      if (hasNativeSelection(event.target as HTMLInputElement)) {
        return;
      }

      const selectedRows = apiRef.current.getSelectedRows();

      if (selectedRows.size > 1) {
        apiRef.current.unstable_copySelectedRowsToClipboard();
      } else {
        apiRef.current.unstable_copyFocusedCellToClipboard();
      }
    },
    [apiRef],
  );

  const handlePaste = React.useCallback(
    async (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (String.fromCharCode(event.keyCode) !== 'V' || !isModifierKeyPressed) {
        return;
      }

      const selectedCell = gridFocusCellSelector(apiRef);
      if (!selectedCell || !selectedCell.id || !selectedCell.field) {
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

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handleCopy);
  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handlePaste);

  const clipboardApi: GridClipboardApi = {
    unstable_copySelectedRowsToClipboard: copySelectedRowsToClipboard,
    unstable_copyFocusedCellToClipboard: copyFocusedCellToClipboard,
  };

  useGridApiMethod(apiRef, clipboardApi, 'public');
};
