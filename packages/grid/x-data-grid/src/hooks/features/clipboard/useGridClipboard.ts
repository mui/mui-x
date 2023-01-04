import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridClipboardApi } from '../../../models/api';
import { GridSignature, useGridApiMethod, useGridNativeEventListener } from '../../utils';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { gridVisibleColumnFieldsSelector } from '../columns/gridColumnsSelector';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridValidRowModel } from '../../../models/gridRows';

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

  const handleKeydown = React.useCallback(
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

      apiRef.current.unstable_copySelectedRowsToClipboard();
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
          newRow[field] = parsedData[i - selectedFieldIndex];
        }

        rowsToUpdate.push(newRow);
      });

      apiRef.current.updateRows(rowsToUpdate);
    },
    [apiRef, props.pagination, props.paginationMode, props.signature],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handleKeydown);
  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handlePaste);

  const clipboardApi: GridClipboardApi = {
    unstable_copySelectedRowsToClipboard: copySelectedRowsToClipboard,
  };

  useGridApiMethod(apiRef, clipboardApi, 'public');
};
