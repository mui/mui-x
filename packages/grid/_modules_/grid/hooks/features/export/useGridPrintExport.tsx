import * as React from 'react';
import ownerDocument from '@material-ui/core/utils/ownerDocument';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { GridPrintExportApi } from '../../../models/api/gridPrintExportApi';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { visibleSortedGridRowsSelector } from '../filter/gridFilterSelector';
import { useGridState } from '../core/useGridState';

export const useGridPrintExport = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridPrintExport');
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedGridRowsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const gridCacheState = React.useRef<any>(null);

  const exportDataAsPrint = React.useCallback((): void => {
    logger.debug(`Export data as Print`);

    setGridState((state) => {
      gridCacheState.current = state;

      return {
        ...state,
        containerSizes: {
          ...state.containerSizes!,
          renderingZone: {
            ...state.containerSizes!.renderingZone,
            height: visibleSortedRows.size * 52,
          },
          renderingZonePageSize: visibleSortedRows.size,
        },
        viewportSizes: { ...state.viewportSizes, height: visibleSortedRows.size * 52 },
      }
    });
    forceUpdate();

    const doc = ownerDocument(apiRef!.current.rootElementRef!.current as HTMLElement);
    const gridRootElement = apiRef!.current.rootElementRef!.current;

    if (!gridRootElement) {
      throw new Error('No Grid Root element available');
    }

    const printWindow = document.createElement('iframe');
    printWindow.style.position = 'absolute';
    printWindow.style.top = '-100px';
    printWindow.style.left = '-100px';
    printWindow.style.width = '0px';
    printWindow.style.height = '0px';
    printWindow.id = 'printWindow';
    printWindow.title = 'Print Window';

    doc.body.appendChild(printWindow);

    printWindow.onload = () => {
      // Some agents, such as IE11 and Enzyme (as of 2 Jun 2020) continuously call the
      // `onload` callback. This ensures that it is only called once.
      printWindow.onload = null;

      const printDoc = printWindow.contentDocument || printWindow.contentWindow?.document;

      if (!printDoc) {
        return;
      }

      const gridClone = gridRootElement.cloneNode(true);
      (gridClone as HTMLElement).style.height = `${visibleSortedRows.size * 52}px`;
      printDoc.body.appendChild(gridClone);

      const headEls = doc.querySelectorAll("style, link[rel='stylesheet']");

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < headEls.length; i++) {
        const node = headEls[i];
        if (node.tagName === 'STYLE') {
          const newHeadEl = printDoc.createElement(node.tagName);
          const sheet = (node as HTMLStyleElement).sheet as CSSStyleSheet;

          if (sheet) {
            let styleCSS = '';
            // NOTE: for-of is not supported by IE
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < sheet.cssRules.length; j++) {
              if (typeof sheet.cssRules[j].cssText === 'string') {
                styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
              }
            }
            newHeadEl.setAttribute('id', `react-to-print-${i}`);
            newHeadEl.appendChild(printDoc.createTextNode(styleCSS));
            printDoc.head.appendChild(newHeadEl);
          }
        } else if (node.getAttribute('href')) {
          // Many browsers will do all sorts of weird things if they encounter an
          // empty `href` tag (which is invalid HTML). Some will attempt to load
          // the current page. Some will attempt to load the page's parent
          // directory. These problems can cause `react-to-print` to stop without
          // any error being thrown. To avoid such problems we simply do not
          // attempt to load these links.

          const newHeadEl = printDoc.createElement(node.tagName);

          // node.attributes has NamedNodeMap type that is not an Array and
          // can be iterated only via direct [i] access
          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < node.attributes.length; j++) {
            // eslint-disable-line max-len
            const attr = node.attributes[j];
            if (attr) {
              newHeadEl.setAttribute(attr.nodeName, attr.nodeValue || '');
            }
          }

          printDoc.head.appendChild(newHeadEl);
        }
      }

      printWindow.contentWindow!.print();
    };

    printWindow.contentWindow!.onafterprint = () => {
      doc.body.removeChild(printWindow);

      // Revert grid to previous state
      setGridState((state) => ({
        ...state,
        ...gridCacheState.current,
      }));
      forceUpdate();
      gridCacheState.current = null;
    };
  }, [logger, apiRef, visibleSortedRows, setGridState, forceUpdate]);

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'GridPrintExportApi');
};
