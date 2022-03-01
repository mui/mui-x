import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridClipboardApi } from '../../../models/api';
import { useGridApiMethod, useGridNativeEventListener } from '../../utils';

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
 * @requires useGridCsvExport (method)
 * @requires useGridSelection (method)
 */
export const useGridClipboard = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  const copySelectedRowsToClipboard = React.useCallback(
    (includeHeaders = false) => {
      if (apiRef.current.getSelectedRows().size === 0) {
        return;
      }

      const data = apiRef.current.getDataAsCsv({
        includeHeaders,
        delimiter: '\t',
      });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(data).catch(() => {
          writeToClipboardPolyfill(data);
        });
      } else {
        writeToClipboardPolyfill(data);
      }
    },
    [apiRef],
  );

  const handleKeydown = React.useCallback(
    (event: KeyboardEvent) => {
      const isModifierKeyPressed = event.ctrlKey || event.metaKey || event.altKey;
      // event.key === 'c' is not enough as alt+c can lead to ©, ç, or other characters on macOS.
      // event.code === 'KeyC' is not enough as event.code assume a QWERTY keyboard layout which would
      // be wrong with a Dvorak keyboard (as if pressing J).
      if (String.fromCharCode(event.keyCode) !== 'C' || !isModifierKeyPressed) {
        return;
      }

      // Do nothing if there's a native selection
      if (window.getSelection()?.toString() !== '') {
        return;
      }

      apiRef.current.unstable_copySelectedRowsToClipboard(event.altKey);
    },
    [apiRef],
  );

  useGridNativeEventListener(apiRef, apiRef.current.rootElementRef!, 'keydown', handleKeydown);

  const clipboardApi: GridClipboardApi = {
    unstable_copySelectedRowsToClipboard: copySelectedRowsToClipboard,
  };

  useGridApiMethod(apiRef, clipboardApi, 'GridClipboardApi');
};
