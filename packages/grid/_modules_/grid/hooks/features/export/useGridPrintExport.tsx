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

type PrintWindowOnLoad = (
  printWindow: HTMLIFrameElement,
  options?: Pick<
    GridPrintExportOptions,
    'copyStyles' | 'bodyClass' | 'pageStyle' | 'hideToolbar' | 'hideFooter'
  >,
) => void;

export const useGridPrintExport = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'rowHeight'>,
): void => {
  const logger = useLogger('useGridPrintExport');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedGridRowsSelector);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const doc = React.useRef<Document | null>(null);
  const previousGridState = React.useRef<any>(null);
  const previousHiddenColumns = React.useRef<string[]>([]);

  React.useEffect(() => {
    doc.current = ownerDocument(apiRef!.current.rootElementRef!.current as HTMLElement);
  }, [apiRef]);

  const prepGridForPrint = React.useCallback(
    (fields?: string[], allColumns?: boolean): void => {
      // Show only wanted columns
      if (fields && fields.length) {
        apiRef!.current.updateColumns(
          columns.map((column) => {
            if (!column.hide) {
              previousHiddenColumns.current.push(column.field);
            }

            // Show all columns
            if (allColumns) {
              column.hide = true;
              return column;
            }

            column.hide = !fields.includes(column.field);

            return column;
          }),
        );
      }

      setGridState((state) => {
        previousGridState.current = state;
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

  const buildPrintWindow = React.useCallback((title?: string): HTMLIFrameElement => {
    const iframeEl = document.createElement('iframe');

    iframeEl.style.position = 'absolute';
    iframeEl.style.width = '0px';
    iframeEl.style.height = '0px';
    iframeEl.title = title || document.title;

    return iframeEl;
  }, []);

  const handlePrintWindowLoad: PrintWindowOnLoad = React.useCallback(
    (printWindow, options): void => {
      const normalizeOptions = {
        copyStyles: true,
        hideToolbar: false,
        hideFooter: false,
        ...options,
      };

      // Some agents, such as IE11 and Enzyme (as of 2 Jun 2020) continuously call the
      // `onload` callback. This ensures that it is only called once.
      printWindow.onload = null;

      const printDoc = printWindow.contentDocument || printWindow.contentWindow?.document;

      if (!printDoc) {
        return;
      }

      const gridRootElement = apiRef!.current.rootElementRef!.current;
      const gridClone = gridRootElement!.cloneNode(true) as HTMLElement;

      if (normalizeOptions.hideToolbar) {
        gridClone.querySelector('.MuiDataGrid-toolbarContainer')?.remove();
      }

      if (normalizeOptions.hideFooter) {
        gridClone.querySelector('.MuiDataGrid-footerContainer')?.remove();
      }

      // Expand container height to accommodate all rows
      gridClone.style.height = `${visibleSortedRows.size * props.rowHeight!}px`;
      printDoc.body.appendChild(gridClone);

      const defaultPageStyle =
        typeof normalizeOptions.pageStyle === 'function'
          ? normalizeOptions.pageStyle()
          : normalizeOptions.pageStyle;
      if (typeof defaultPageStyle !== 'string') {
        const styleElement = printDoc.createElement('style');
        styleElement.appendChild(printDoc.createTextNode(defaultPageStyle));
        printDoc.head.appendChild(styleElement);
      }

      if (normalizeOptions.bodyClass) {
        printDoc.body.classList.add(...normalizeOptions.bodyClass.split(' '));
      }

      if (normalizeOptions.copyStyles) {
        const headStyleElements = doc.current!.querySelectorAll("style, link[rel='stylesheet']");

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < headStyleElements.length; i++) {
          const node = headStyleElements[i];
          if (node.tagName === 'STYLE') {
            const newHeadStyleElements = printDoc.createElement(node.tagName);
            const sheet = (node as HTMLStyleElement).sheet;

            if (sheet) {
              let styleCSS = '';
              // NOTE: for-of is not supported by IE
              // eslint-disable-next-line no-plusplus
              for (let j = 0; j < sheet.cssRules.length; j++) {
                if (typeof sheet.cssRules[j].cssText === 'string') {
                  styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
                }
              }
              newHeadStyleElements.appendChild(printDoc.createTextNode(styleCSS));
              printDoc.head.appendChild(newHeadStyleElements);
            }
          } else if (node.getAttribute('href')) {
            // If `href` tag is empty, avoid loading these links

            const newHeadStyleElements = printDoc.createElement(node.tagName);

            // node.attributes is of type NamedNodeMap
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < node.attributes.length; j++) {
              const attr = node.attributes[j];
              if (attr) {
                newHeadStyleElements.setAttribute(attr.nodeName, attr.nodeValue || '');
              }
            }

            printDoc.head.appendChild(newHeadStyleElements);
          }
        }
      }

      // Trigger print
      printWindow.contentWindow!.print();
    },
    [apiRef, doc, visibleSortedRows.size, props.rowHeight],
  );

  const handlePrintWindowAfterPrint = React.useCallback(
    (printWindow: HTMLIFrameElement): void => {
      // Remove the print iframe
      doc.current!.body.removeChild(printWindow);

      // Revert columns to their original state
      apiRef!.current.updateColumns(
        columns.map((column) => {
          if (previousHiddenColumns.current.includes(column.field)) {
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
        ...previousGridState.current,
      }));
      forceUpdate();

      // Clear local state
      previousGridState.current = null;
      previousHiddenColumns.current = [];
    },
    [previousGridState, previousHiddenColumns, columns, apiRef, setGridState, forceUpdate],
  );

  const exportDataAsPrint = React.useCallback(
    (options?: GridPrintExportOptions): void => {
      logger.debug(`Export data as Print`);

      if (!apiRef!.current.rootElementRef!.current) {
        throw new Error('No Grid Root element available');
      }

      prepGridForPrint(options?.fields, options?.allColumns);
      const printWindow = buildPrintWindow(options?.fileName);

      doc.current!.body.appendChild(printWindow);

      printWindow.onload = () => handlePrintWindowLoad(printWindow, options);
      printWindow.contentWindow!.onafterprint = () => handlePrintWindowAfterPrint(printWindow);
    },
    [
      logger,
      apiRef,
      prepGridForPrint,
      buildPrintWindow,
      handlePrintWindowLoad,
      handlePrintWindowAfterPrint,
    ],
  );

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'GridPrintExportApi');
};
