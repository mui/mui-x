import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { buildCSV } from '../export/serializers/csvSerializer';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../models/colDef';
import { GridClipboardApi } from '../../../models/api';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useNativeEventListener } from '../../root';

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

/**
 * @requires useGridColumns (state)
 * @requires useGridParamsApi (method)
 * @requires useGridSelection (method)
 */
export const useGridClipboard = (apiRef: GridApiRef): void => {
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const copySelectedRowsToClipboard = React.useCallback(
    (includeHeaders = false) => {
      const selectedRows = apiRef.current.getSelectedRows();
      const filteredColumns = visibleColumns.filter(
        (column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field,
      );

      if (selectedRows.size === 0 || filteredColumns.length === 0) {
        return;
      }

      const data = buildCSV({
        columns: visibleColumns,
        rows: selectedRows,
        selectedRowIds: [],
        includeHeaders,
        getCellParams: apiRef.current.getCellParams,
        delimiterCharacter: '\t',
      });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(data).catch(() => {
          writeToClipboardPolyfill(data);
        });
      } else {
        writeToClipboardPolyfill(data);
      }
    },
    [apiRef, visibleColumns],
  );

  const handleKeydown = React.useCallback(
    (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (event.key.toLowerCase() !== 'c' || !isModifierKeyPressed) {
        return;
      }

      // Do nothing if there's a native selection
      if (window.getSelection()?.toString() !== '') {
        return;
      }

      apiRef.current.copySelectedRowsToClipboard(event.altKey);
    },
    [apiRef],
  );

  useNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handleKeydown);

  const clipboardApi: GridClipboardApi = {
    copySelectedRowsToClipboard,
  };

  useGridApiMethod(apiRef, clipboardApi, 'GridClipboardApi');
};
