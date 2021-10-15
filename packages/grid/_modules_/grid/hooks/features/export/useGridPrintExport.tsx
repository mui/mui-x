import * as React from 'react';
import { ownerDocument } from '@mui/material/utils';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPrintExportApi } from '../../../models/api/gridPrintExportApi';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridVisibleRowCountSelector } from '../filter/gridFilterSelector';

import { GridComponentProps } from '../../../GridComponentProps';
import { GridPrintExportOptions } from '../../../models/gridExport';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import {
  gridDensityRowHeightSelector,
  gridDensityHeaderHeightSelector,
} from '../density/densitySelector';
import { gridClasses } from '../../../gridClasses';
import { useGridState } from '../../utils/useGridState';
import { useGridSelector } from '../../utils/useGridSelector';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

type PrintWindowOnLoad = (
  printWindow: HTMLIFrameElement,
  options?: Pick<
    GridPrintExportOptions,
    'copyStyles' | 'bodyClassName' | 'pageStyle' | 'hideToolbar' | 'hideFooter'
  >,
) => void;

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridNoVirtualization (method)
 * @requires useGridParamsApi (method)
 */
export const useGridPrintExport = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridPrintExport');
  const [gridState, setGridState] = useGridState(apiRef);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const visibleRowCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const doc = React.useRef<Document | null>(null);
  const previousGridState = React.useRef<any>();
  const previousHiddenColumns = React.useRef<string[]>([]);

  React.useEffect(() => {
    doc.current = ownerDocument(apiRef.current.rootElementRef!.current!);
  }, [apiRef]);

  // Returns a promise because updateColumns triggers state update and
  // the new state needs to be in place before the grid can be sized correctly
  const updateGridColumnsForPrint = React.useCallback(
    (fields?: string[], allColumns?: boolean) =>
      new Promise<void>((resolve) => {
        if (!fields && !allColumns) {
          resolve();
          return;
        }

        // Show only wanted columns.
        apiRef.current.updateColumns(
          columns.map((column) => {
            if (column.hide) {
              previousHiddenColumns.current.push(column.field);
            }

            // Show all columns
            if (allColumns) {
              column.hide = false;
              return column;
            }

            column.hide = !fields?.includes(column.field) || column.disableExport;

            return column;
          }),
        );
        resolve();
      }),
    [columns, apiRef],
  );

  const buildPrintWindow = React.useCallback((title?: string): HTMLIFrameElement => {
    const iframeEl = document.createElement('iframe');

    iframeEl.id = 'grid-print-window';
    // Without this 'onload' event won't fire in some browsers
    iframeEl.src = window.location.href;
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

      const gridRootElement = apiRef.current.rootElementRef!.current;
      const gridClone = gridRootElement!.cloneNode(true) as HTMLElement;
      const gridCloneViewport: HTMLElement | null = gridClone.querySelector(
        `.${gridClasses.virtualScroller}`,
      );
      // Expand the viewport window to prevent clipping
      gridCloneViewport!.style.height = 'auto';

      let gridToolbarElementHeight =
        gridRootElement!.querySelector(`.${gridClasses.toolbarContainer}`)?.clientHeight || 0;
      let gridFooterElementHeight =
        gridRootElement!.querySelector(`.${gridClasses.footerContainer}`)?.clientHeight || 0;

      if (normalizeOptions.hideToolbar) {
        gridClone.querySelector(`.${gridClasses.toolbarContainer}`)?.remove();
        gridToolbarElementHeight = 0;
      }

      if (normalizeOptions.hideFooter) {
        gridClone.querySelector(`.${gridClasses.footerContainer}`)?.remove();
        gridFooterElementHeight = 0;
      }

      // Expand container height to accommodate all rows
      gridClone.style.height = `${
        visibleRowCount * rowHeight +
        headerHeight +
        gridToolbarElementHeight +
        gridFooterElementHeight
      }px`;

      // Remove all loaded elements from the current host
      printDoc.body.innerHTML = '';
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

      if (normalizeOptions.bodyClassName) {
        printDoc.body.classList.add(...normalizeOptions.bodyClassName.split(' '));
      }

      if (normalizeOptions.copyStyles) {
        const headStyleElements = doc.current!.querySelectorAll("style, link[rel='stylesheet']");

        for (let i = 0; i < headStyleElements.length; i += 1) {
          const node = headStyleElements[i];
          if (node.tagName === 'STYLE') {
            const newHeadStyleElements = printDoc.createElement(node.tagName);
            const sheet = (node as HTMLStyleElement).sheet;

            if (sheet) {
              let styleCSS = '';
              // NOTE: for-of is not supported by IE
              for (let j = 0; j < sheet.cssRules.length; j += 1) {
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

            for (let j = 0; j < node.attributes.length; j += 1) {
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
    [apiRef, doc, visibleRowCount, rowHeight, headerHeight],
  );

  const handlePrintWindowAfterPrint = React.useCallback(
    (printWindow: HTMLIFrameElement): void => {
      // Remove the print iframe
      doc.current!.body.removeChild(printWindow);

      // Revert grid to previous state
      setGridState((state) => ({
        ...state,
        ...previousGridState.current,
      }));

      apiRef.current.UNSTABLE_enableVirtualization();

      // Revert columns to their original state
      if (previousHiddenColumns.current.length) {
        apiRef.current.updateColumns(
          columns.map((column) => {
            column.hide = previousHiddenColumns.current.includes(column.field);
            return column;
          }),
        );
      }

      // Clear local state
      previousGridState.current = null;
      previousHiddenColumns.current = [];
    },
    [columns, apiRef, setGridState],
  );

  const exportDataAsPrint = React.useCallback(
    async (options?: GridPrintExportOptions) => {
      logger.debug(`Export data as Print`);

      if (!apiRef.current.rootElementRef!.current) {
        throw new Error('MUI: No grid root element available.');
      }

      previousGridState.current = gridState;

      if (props.pagination) {
        apiRef.current.setPageSize(visibleRowCount);
      }

      await updateGridColumnsForPrint(options?.fields, options?.allColumns);
      apiRef.current.UNSTABLE_disableVirtualization();
      const printWindow = buildPrintWindow(options?.fileName);
      doc.current!.body.appendChild(printWindow);
      printWindow.onload = () => handlePrintWindowLoad(printWindow, options);
      printWindow.contentWindow!.onafterprint = () => handlePrintWindowAfterPrint(printWindow);
    },
    [
      visibleRowCount,
      props,
      logger,
      apiRef,
      gridState,
      buildPrintWindow,
      handlePrintWindowLoad,
      handlePrintWindowAfterPrint,
      updateGridColumnsForPrint,
    ],
  );

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'GridPrintExportApi');
};
