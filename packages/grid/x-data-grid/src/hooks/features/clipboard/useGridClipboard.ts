import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridClipboardApi } from '../../../models/api';
import { useGridApiMethod, useGridNativeEventListener } from '../../utils';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { GridRowId } from '../../../models/gridRows';

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
export const useGridClipboard = (apiRef: React.MutableRefObject<GridPrivateApiCommunity>): void => {
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

    copyToClipboard(data);
  }, [apiRef]);

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

      let textToCopy = apiRef.current.unstable_applyPipeProcessors('clipboardCopy', '');

      if (!textToCopy) {
        const selectedRows = apiRef.current.getSelectedRows();
        if (selectedRows.size > 1) {
          textToCopy = apiRef.current.getDataAsCsv({
            includeHeaders: false,
            // TODO: make it configurable
            delimiter: '\t',
          });
        } else {
          const focusedCell = gridFocusCellSelector(apiRef);
          if (focusedCell) {
            textToCopy = stringifyCellForClipboard(focusedCell.id, focusedCell.field);
          }
        }
      }

      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    },
    [apiRef, stringifyCellForClipboard],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handleCopy);

  const clipboardApi: GridClipboardApi = {
    unstable_copySelectedRowsToClipboard: copySelectedRowsToClipboard,
  };

  useGridApiMethod(apiRef, clipboardApi, 'public');
};
