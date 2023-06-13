import * as React from 'react';
import { unstable_ownerDocument as ownerDocument } from '@mui/utils';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridPrintExportApi } from '../../../models/api/gridPrintExportApi';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridExpandedRowCountSelector } from '../filter/gridFilterSelector';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrintExportOptions } from '../../../models/gridExport';
import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';
import {
  gridColumnDefinitionsSelector,
  gridColumnVisibilityModelSelector,
} from '../columns/gridColumnsSelector';
import { gridClasses } from '../../../constants/gridClasses';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { getColumnsToExport } from './utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import {
  GridExportDisplayOptions,
  GridPrintExportMenuItem,
} from '../../../components/toolbar/GridToolbarExport';
import { getTotalHeaderHeight } from '../columns/gridColumnsUtils';

function raf() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

type PrintWindowOnLoad = (
  printWindow: HTMLIFrameElement,
  options?: Pick<
    GridPrintExportOptions,
    'copyStyles' | 'bodyClassName' | 'pageStyle' | 'hideToolbar' | 'hideFooter'
  >,
) => void;

function buildPrintWindow(title?: string): HTMLIFrameElement {
  const iframeEl = document.createElement('iframe');
  iframeEl.style.position = 'absolute';
  iframeEl.style.width = '0px';
  iframeEl.style.height = '0px';
  iframeEl.title = title || document.title;
  return iframeEl;
}

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridParamsApi (method)
 */
export const useGridPrintExport = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'pagination' | 'columnHeaderHeight'>,
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
        // TODO remove unused Promise
        if (!fields && !allColumns) {
          resolve();
          return;
        }

        const exportedColumnFields = getColumnsToExport({
          apiRef,
          options: { fields, allColumns },
        }).map((column) => column.field);

        const columns = gridColumnDefinitionsSelector(apiRef);

        const newColumnVisibilityModel: Record<string, boolean> = {};
        columns.forEach((column) => {
          newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
        });

        apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
        resolve();
      }),
    [apiRef],
  );

  const handlePrintWindowLoad: PrintWindowOnLoad = React.useCallback(
    (printWindow, options): void => {
      const normalizeOptions = {
        copyStyles: true,
        hideToolbar: false,
        hideFooter: false,
        ...options,
      };

      const printDoc = printWindow.contentDocument;

      if (!printDoc) {
        return;
      }

      const rowsMeta = gridRowsMetaSelector(apiRef.current.state);

      const gridRootElement = apiRef.current.rootElementRef!.current;
      const gridClone = gridRootElement!.cloneNode(true) as HTMLElement;

      // Allow to overflow to not hide the border of the last row
      const gridMain: HTMLElement | null = gridClone.querySelector(`.${gridClasses.main}`);
      gridMain!.style.overflow = 'visible';

      // See https://support.google.com/chrome/thread/191619088?hl=en&msgid=193009642
      gridClone!.style.contain = 'size';

      const columnHeaders = gridClone.querySelector(`.${gridClasses.columnHeaders}`);
      const columnHeadersInner = columnHeaders!.querySelector<HTMLElement>(
        `.${gridClasses.columnHeadersInner}`,
      )!;
      columnHeadersInner.style.width = '100%';

      let gridToolbarElementHeight =
        gridRootElement!.querySelector<HTMLElement>(`.${gridClasses.toolbarContainer}`)
          ?.offsetHeight || 0;
      let gridFooterElementHeight =
        gridRootElement!.querySelector<HTMLElement>(`.${gridClasses.footerContainer}`)
          ?.offsetHeight || 0;

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
        getTotalHeaderHeight(apiRef, props.columnHeaderHeight) +
        gridToolbarElementHeight +
        gridFooterElementHeight
      }px`;
      // The height above does not include grid border width, so we need to exclude it
      gridClone.style.boxSizing = 'content-box';

      // printDoc.body.appendChild(gridClone); should be enough but a clone isolation bug in Safari
      // prevents us to do it
      const container = document.createElement('div');
      container.appendChild(gridClone);
      printDoc.body.innerHTML = container.innerHTML;

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
        const rootCandidate = gridRootElement!.getRootNode();
        const root =
          rootCandidate.constructor.name === 'ShadowRoot'
            ? (rootCandidate as ShadowRoot)
            : doc.current;
        const headStyleElements = root!.querySelectorAll("style, link[rel='stylesheet']");

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
    [apiRef, doc, props.columnHeaderHeight],
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

  const exportDataAsPrint = React.useCallback<GridPrintExportApi['exportDataAsPrint']>(
    async (options) => {
      logger.debug(`Export data as Print`);

      if (!apiRef.current.rootElementRef!.current) {
        throw new Error('MUI: No grid root element available.');
      }

      previousGridState.current = apiRef.current.exportState();
      // It appends that the visibility model is not exported, especially if columnVisibility is not controlled
      previousColumnVisibility.current = gridColumnVisibilityModelSelector(apiRef);

      if (props.pagination) {
        const visibleRowCount = gridExpandedRowCountSelector(apiRef);
        apiRef.current.setPageSize(visibleRowCount);
      }

      await updateGridColumnsForPrint(options?.fields, options?.allColumns);
      apiRef.current.unstable_disableVirtualization();
      await raf(); // wait for the state changes to take action
      const printWindow = buildPrintWindow(options?.fileName);
      if (process.env.NODE_ENV === 'test') {
        doc.current!.body.appendChild(printWindow);
        // In test env, run the all pipeline without waiting for loading
        handlePrintWindowLoad(printWindow, options);
        handlePrintWindowAfterPrint(printWindow);
      } else {
        printWindow.onload = () => {
          handlePrintWindowLoad(printWindow, options);

          const mediaQueryList = printWindow.contentWindow!.matchMedia('print');
          mediaQueryList.addEventListener('change', (mql) => {
            const isAfterPrint = mql.matches === false;
            if (isAfterPrint) {
              handlePrintWindowAfterPrint(printWindow);
            }
          });
        };
        doc.current!.body.appendChild(printWindow);
      }
    },
    [
      props,
      logger,
      apiRef,
      handlePrintWindowLoad,
      handlePrintWindowAfterPrint,
      updateGridColumnsForPrint,
    ],
  );

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback<GridPipeProcessor<'exportMenu'>>(
    (
      initialValue,
      options: { printOptions: GridPrintExportOptions & GridExportDisplayOptions },
    ) => {
      if (options.printOptions?.disableToolbarButton) {
        return initialValue;
      }
      return [
        ...initialValue,
        {
          component: <GridPrintExportMenuItem options={options.printOptions} />,
          componentName: 'printExport',
        },
      ];
    },
    [],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);
};
