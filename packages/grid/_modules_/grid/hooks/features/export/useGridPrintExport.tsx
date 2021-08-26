import * as React from 'react';
import ownerDocument from '@material-ui/core/utils/ownerDocument';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { GridPrintExportApi } from '../../../models/api/gridPrintExportApi';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { visibleSortedGridRowsSelector } from '../filter/gridFilterSelector';
import { useGridState } from '../core/useGridState';
import { GridComponentProps } from '../../../GridComponentProps';

export const useGridPrintExport = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'rowHeight'>,
): void => {
  const logger = useLogger('useGridPrintExport');
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedGridRowsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const gridCacheState = React.useRef<any>(null);
  const doc = React.useRef<Document | null>(null);
  const printWindow = React.useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    doc.current = ownerDocument(apiRef!.current.rootElementRef!.current as HTMLElement);
  }, [apiRef]);

  const prepGridForPrint = React.useCallback((): void => {
    setGridState((state) => {
      gridCacheState.current = state;

      return {
        ...state,
        containerSizes: {
          ...state.containerSizes!,
          renderingZone: {
            ...state.containerSizes!.renderingZone,
            height: visibleSortedRows.size * props.rowHeight!,
          },
          renderingZonePageSize: visibleSortedRows.size,
        },
        viewportSizes: {
          ...state.viewportSizes,
          height: visibleSortedRows.size * props.rowHeight!,
        },
      };
    });
    forceUpdate();
  }, [visibleSortedRows, props.rowHeight, setGridState, forceUpdate]);

  const buildPrintWindow = React.useCallback((): void => {
    const iframeEl = document.createElement('iframe');
    iframeEl.style.position = 'absolute';
    iframeEl.style.top = '-100px';
    iframeEl.style.left = '-100px';
    iframeEl.style.width = '0px';
    iframeEl.style.height = '0px';
    iframeEl.id = 'printWindow';
    iframeEl.title = 'Print Window';

    printWindow.current = iframeEl;
  }, []);

  const handlePrintWindowOnLoad = React.useCallback((): void => {
    // Some agents, such as IE11 and Enzyme (as of 2 Jun 2020) continuously call the
    // `onload` callback. This ensures that it is only called once.
    printWindow.current!.onload = null;

    const printDoc =
      printWindow.current!.contentDocument || printWindow.current!.contentWindow?.document;

    if (!printDoc) {
      return;
    }

    const gridRootElement = apiRef!.current.rootElementRef!.current;
    const gridClone = gridRootElement!.cloneNode(true);
    (gridClone as HTMLElement).style.height = `${visibleSortedRows.size * props.rowHeight!}px`;
    printDoc.body.appendChild(gridClone);
    const headEls = doc.current!.querySelectorAll("style, link[rel='stylesheet']");

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

    printWindow.current!.contentWindow!.print();
  }, [apiRef, doc, visibleSortedRows.size, props.rowHeight]);

  const handlePrintWindowOnAfterPrint = React.useCallback((): void => {
    doc.current!.body.removeChild(printWindow.current!);

    // Revert grid to previous state
    setGridState((state) => ({
      ...state,
      ...gridCacheState.current,
    }));
    forceUpdate();
    gridCacheState.current = null;
  }, [setGridState, forceUpdate, gridCacheState]);

  const exportDataAsPrint = React.useCallback((): void => {
    logger.debug(`Export data as Print`);

    if (!apiRef!.current.rootElementRef!.current) {
      throw new Error('No Grid Root element available');
    }

    prepGridForPrint();
    buildPrintWindow();

    doc.current!.body.appendChild(printWindow.current!);

    printWindow.current!.onload = handlePrintWindowOnLoad;
    printWindow.current!.contentWindow!.onafterprint = handlePrintWindowOnAfterPrint;
  }, [
    logger,
    apiRef,
    prepGridForPrint,
    buildPrintWindow,
    handlePrintWindowOnLoad,
    handlePrintWindowOnAfterPrint,
  ]);

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'GridPrintExportApi');
};
