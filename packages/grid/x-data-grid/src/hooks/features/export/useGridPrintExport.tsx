import * as React from 'react';
import { ownerDocument } from '@mui/material/utils';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridPrintExportApi } from '../../../models/api/gridPrintExportApi';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridVisibleRowCountSelector } from '../filter/gridFilterSelector';

import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrintExportOptions } from '../../../models/gridExport';
import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';
import {
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
} from '../columns/gridColumnsSelector';
import { gridDensityHeaderHeightSelector } from '../density/densitySelector';
import { gridClasses } from '../../../constants/gridClasses';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { getColumnsToExport } from './utils';

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
 * @requires useGridParamsApi (method)
 */
export const useGridPrintExport = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridPrintExport');
  const doc = React.useRef<Document | null>(null);
  const previousGridState = React.useRef<GridInitialStateCommunity | null>(null);
  const previousColumnVisibility = React.useRef<{ [key: string]: boolean }>({});

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

        const exportedColumnFields = getColumnsToExport({
          apiRef,
          options: { fields, allColumns },
        }).map((column) => column.field);

        const columns = gridColumnDefinitionsSelector(apiRef);

        const newColumnVisibilityModel = {};
        columns.forEach((column) => {
          newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
        });

        apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);

        resolve();
      }),
    [apiRef],
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

      const headerHeight = gridDensityHeaderHeightSelector(apiRef);
      const rowsMeta = gridRowsMetaSelector(apiRef.current.state);

      const gridRootElement = apiRef.current.rootElementRef!.current;
      const gridClone = gridRootElement!.cloneNode(true) as HTMLElement;
      const gridCloneViewport: HTMLElement | null = gridClone.querySelector(
        `.${gridClasses.virtualScroller}`,
      );
      // Expand the viewport window to prevent clipping
      gridCloneViewport!.style.height = 'auto';
      gridCloneViewport!.style.width = 'auto';
      gridCloneViewport!.parentElement!.style.width = 'auto';
      gridCloneViewport!.parentElement!.style.height = 'auto';

      // Allow to overflow to not hide the border of the last row
      const gridMain: HTMLElement | null = gridClone.querySelector(`.${gridClasses.main}`);
      gridMain!.style.overflow = 'visible';

      const columnHeaders = gridClone.querySelector(`.${gridClasses.columnHeaders}`);
      const columnHeadersInner = columnHeaders!.querySelector(
        `.${gridClasses.columnHeadersInner}`,
      ) as HTMLElement;
      columnHeadersInner.style.width = '100%';

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
        rowsMeta.currentPageTotalHeight +
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
      if (typeof defaultPageStyle === 'string') {
        // TODO custom styles should always win
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
      if (process.env.NODE_ENV !== 'test') {
        printWindow.contentWindow!.print();
      }
    },
    [apiRef, doc],
  );

  const handlePrintWindowAfterPrint = React.useCallback(
    (printWindow: HTMLIFrameElement): void => {
      // Remove the print iframe
      doc.current!.body.removeChild(printWindow);

      // Revert grid to previous state
      apiRef.current.restoreState(previousGridState.current || {});
      if (!previousGridState.current?.columns?.columnVisibilityModel) {
        // if the apiRef.current.exportState(); did not exported the column visibility, we update it
        apiRef.current.setColumnVisibilityModel(previousColumnVisibility.current);
      }

      apiRef.current.unstable_enableVirtualization();

      // Clear local state
      previousGridState.current = null;
      previousColumnVisibility.current = {};
    },
    [apiRef],
  );

  const exportDataAsPrint = React.useCallback(
    async (options?: GridPrintExportOptions) => {
      logger.debug(`Export data as Print`);

      if (!apiRef.current.rootElementRef!.current) {
        throw new Error('MUI: No grid root element available.');
      }

      previousGridState.current = apiRef.current.exportState();
      // It appends that the visibility model is not exported, especially if columnVisibility is not controlled
      previousColumnVisibility.current = gridColumnVisibilityModelSelector(apiRef);

      if (props.pagination) {
        const visibleRowCount = gridVisibleRowCountSelector(apiRef);
        apiRef.current.setPageSize(visibleRowCount);
      }

      await updateGridColumnsForPrint(options?.fields, options?.allColumns);
      apiRef.current.unstable_disableVirtualization();
      const printWindow = buildPrintWindow(options?.fileName);
      doc.current!.body.appendChild(printWindow);
      if (process.env.NODE_ENV === 'test') {
        // In test env, run the all pipeline without waiting for loading
        handlePrintWindowLoad(printWindow, options);
        handlePrintWindowAfterPrint(printWindow);
      } else {
        printWindow.onload = () => handlePrintWindowLoad(printWindow, options);
        printWindow.contentWindow!.onafterprint = () => handlePrintWindowAfterPrint(printWindow);
      }
    },
    [
      props,
      logger,
      apiRef,
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
