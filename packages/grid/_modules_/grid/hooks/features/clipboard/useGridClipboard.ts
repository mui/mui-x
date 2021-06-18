import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GRID_KEYDOWN } from '../../../constants/eventsConstants';
import { serialiseRow, serialiseCellValue } from '../export/serializers/csvSerializer';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { gridCheckboxSelectionColDef } from '../../../models/colDef';
import { GridClipboardApi } from '../../../models/api';
import { useGridApiMethod } from '../../root/useGridApiMethod';

export const useGridClipboard = (apiRef: GridApiRef): void => {
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const writeToClipboardPolyfill = React.useCallback(
    (data: string) => {
      const textarea = document.createElement('textarea');
      textarea.style.opacity = '0px';
      textarea.value = data;
      apiRef.current.rootElementRef!.current!.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      apiRef.current.rootElementRef!.current!.removeChild(textarea);
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

      const headers = `${filteredColumns
        .map((column) => serialiseCellValue(column.headerName || column.field, '\t'))
        .join('\t')}\r\n`;

      const data = [...selectedRows.keys()].reduce<string>(
        (acc, id) =>
          `${acc}${serialiseRow(id, filteredColumns, apiRef.current.getCellParams, '\t').join(
            '\t',
          )}\r\n`,
        includeHeaders ? headers : '',
      );

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
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      if (event.key.toLowerCase() !== 'c' || !isCtrlPressed) {
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
