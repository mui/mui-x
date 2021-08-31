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
import { GridPrintExportOptions } from '../../../models/gridExport';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';

export const useGridPrintExport = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'rowHeight'>,
): void => {
  const logger = useLogger('useGridPrintExport');
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedGridRowsSelector);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const gridCacheState = React.useRef<any>(null);
  const doc = React.useRef<Document | null>(null);
  const defaultHiddenColumns = React.useRef<string[]>([]);

  React.useEffect(() => {
    doc.current = ownerDocument(apiRef!.current.rootElementRef!.current as HTMLElement);
  }, [apiRef]);

  const prepGridForPrint = React.useCallback(
    (fields = [], allColumns): void => {
      const hiddenColumns: string[] = [];

      if (fields.lenght) {
        apiRef!.current.updateColumns(
          columns.map((column) => {
            if (!column.hide) {
              hiddenColumns.push(column.field);
            }

            if (allColumns) {
              column.hide = true;
              return column;
            }

            if (!fields.includes(column.field)) {
              column.hide = true;
            } else {
              column.hide = false;
            }

            return column;
          }),
        );
      }

      defaultHiddenColumns.current = hiddenColumns;

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
    },
    [columns, visibleSortedRows, props.rowHeight, apiRef, setGridState, forceUpdate],
  );

  const buildPrintWindow = React.useCallback((title): HTMLIFrameElement => {
    const iframeEl = document.createElement('iframe');
    iframeEl.style.position = 'absolute';
    iframeEl.style.top = '-100px';
    iframeEl.style.left = '-100px';
    iframeEl.style.width = '0px';
    iframeEl.style.height = '0px';
    iframeEl.title = title;

    return iframeEl;
  }, []);

  const handlePrintWindowOnLoad = React.useCallback(
    (printWindow, copyStyles, bodyClass, pageStyle, hideToolbar, hideFooter): void => {
      // Some agents, such as IE11 and Enzyme (as of 2 Jun 2020) continuously call the
      // `onload` callback. This ensures that it is only called once.
      printWindow.onload = null;

      const printDoc = printWindow.contentDocument || printWindow.contentWindow?.document;

      if (!printDoc) {
        return;
      }

      const gridRootElement = apiRef!.current.rootElementRef!.current;
      const gridClone = gridRootElement!.cloneNode(true) as HTMLElement;
      if (hideToolbar) {
        (gridClone.querySelector('.MuiDataGrid-toolbarContainer') as HTMLElement).style.display =
          'none';
      }

      if (hideFooter) {
        (gridClone.querySelector('.MuiDataGrid-footerContainer') as HTMLElement).style.display =
          'none';
      }

      gridClone.style.height = `${visibleSortedRows.size * props.rowHeight!}px`;
      printDoc.body.appendChild(gridClone);

      const defaultPageStyle = typeof pageStyle === 'function' ? pageStyle() : pageStyle;
      if (typeof defaultPageStyle !== 'string') {
        const styleElement = printDoc.createElement('style');
        styleElement.appendChild(printDoc.createTextNode(defaultPageStyle));
        printDoc.head.appendChild(styleElement);
      }

      if (bodyClass) {
        printDoc.body.classList.add(...bodyClass.split(' '));
      }

      if (copyStyles) {
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
      }

      printWindow.contentWindow!.print();
    },
    [apiRef, doc, visibleSortedRows.size, props.rowHeight],
  );

  const handlePrintWindowOnAfterPrint = React.useCallback(
    (printWindow): void => {
      doc.current!.body.removeChild(printWindow);

      apiRef!.current.updateColumns(
        columns.map((column) => {
          if (defaultHiddenColumns.current.includes(column.field)) {
            column.hide = true;
          } else {
            column.hide = false;
          }
          return column;
        }),
      );

      // Revert grid to previous state
      setGridState((state) => ({
        ...state,
        ...gridCacheState.current,
      }));
      forceUpdate();

      gridCacheState.current = null;
      defaultHiddenColumns.current = [];
    },
    [gridCacheState, defaultHiddenColumns, columns, apiRef, setGridState, forceUpdate],
  );

  const exportDataAsPrint = React.useCallback(
    (options?: GridPrintExportOptions): void => {
      logger.debug(`Export data as Print`);

      const allOptions = {
        fileName: document.title,
        allColumns: false,
        copyStyles: true,
        hideToolbar: true,
        hideFooter: true,
        ...options,
      };

      if (!apiRef!.current.rootElementRef!.current) {
        throw new Error('No Grid Root element available');
      }

      prepGridForPrint(allOptions.fields, allOptions.allColumns);
      const printWindow = buildPrintWindow(allOptions.fileName);

      doc.current!.body.appendChild(printWindow);

      printWindow.onload = () =>
        handlePrintWindowOnLoad(
          printWindow,
          allOptions.copyStyles,
          allOptions.bodyClass,
          allOptions.pageStyle,
          allOptions.hideToolbar,
          allOptions.hideFooter,
        );
      printWindow.contentWindow!.onafterprint = () => handlePrintWindowOnAfterPrint(printWindow);
    },
    [
      logger,
      apiRef,
      prepGridForPrint,
      buildPrintWindow,
      handlePrintWindowOnLoad,
      handlePrintWindowOnAfterPrint,
    ],
  );

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'GridPrintExportApi');
};
