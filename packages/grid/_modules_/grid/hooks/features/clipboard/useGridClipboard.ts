import * as React from 'react';
import { ownerDocument } from '@material-ui/core/utils';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GRID_KEYDOWN } from '../../../constants/eventsConstants';
import { buildCSV } from '../export/serializers/csvSerializer';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { gridCheckboxSelectionColDef } from '../../../models/colDef';
import { GridClipboardApi } from '../../../models/api';
import { useGridApiMethod } from '../../root/useGridApiMethod';

export const useGridClipboard = (apiRef: GridApiRef): void => {
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const writeToClipboardPolyfill = React.useCallback(
    (data: string) => {
      const doc = ownerDocument(apiRef.current.rootElementRef!.current!);
      const span = doc.createElement('span');
      span.style.whiteSpace = 'pre';
      span.style.userSelect = 'all';
      span.style.opacity = '0px';
      span.textContent = data;

      apiRef.current.rootElementRef!.current!.appendChild(span);

      const range = doc.createRange();
      range.selectNode(span);
      const selection = window.getSelection();
      selection!.removeAllRanges();
      selection!.addRange(range);

      try {
        doc.execCommand('copy');
      } finally {
        apiRef.current.rootElementRef!.current!.removeChild(span);
      }
    },
    [apiRef],
  );

  const copySelectedRowsToClipboard = React.useCallback(
    (includeHeaders = false) => {
      const selectedRows = apiRef.current.getSelectedRows();
      const filteredColumns = visibleColumns.filter(
        (column) => column.field !== gridCheckboxSelectionColDef.field,
      );

      if (selectedRows.size === 0 || filteredColumns.length === 0) {
        return;
      }

      const data = buildCSV({
        columns: visibleColumns,
        rows: selectedRows,
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
    [apiRef, visibleColumns, writeToClipboardPolyfill],
  );

  const handleKeydown = React.useCallback(
    (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      if (event.key.toLowerCase() !== 'c' || !isModifierKeyPressed) {
        return;
      }

      const selection = window.getSelection();
      if (
        selection?.anchorNode &&
        apiRef.current.windowRef?.current?.contains(selection.anchorNode) &&
        selection.toString() !== ''
      ) {
        // Do nothing if there's a native selection
        return;
      }

      apiRef.current.copySelectedRowsToClipboard(event.altKey);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_KEYDOWN, handleKeydown);

  const clipboardApi: GridClipboardApi = {
    copySelectedRowsToClipboard,
  };

  useGridApiMethod(apiRef, clipboardApi, 'GridClipboardApi');
};
