import * as React from 'react';
import {
  useGridApiMethod,
  useGridLogger,
  GridExportDisplayOptions,
  useGridApiOptionHandler,
} from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  exportAs,
  getColumnsToExport,
  defaultGetRowsToExport,
  GridPipeProcessor,
} from '@mui/x-data-grid/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProps } from '../../../models/dataGridPremiumProps';
import {
  GridExcelExportApi,
  GridExportExtension,
  GridExcelExportOptions,
} from './gridExcelExportInterface';
import {
  buildExcel,
  ExcelExportInitEvent,
  getDataForValueOptionsSheet,
  serializeColumns,
  serializeRowUnsafe,
} from './serializer/excelSerializer';
import { GridExcelExportMenuItem } from '../../../components';

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export const useGridExcelExport = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProps,
): void => {
  const logger = useGridLogger(apiRef, 'useGridExcelExport');

  const getDataAsExcel = React.useCallback<GridExcelExportApi['getDataAsExcel']>(
    (options = {}) => {
      logger.debug(`Get data as excel`);

      const getRowsToExport = options.getRowsToExport ?? defaultGetRowsToExport;
      const exportedRowIds = getRowsToExport({ apiRef });

      const exportedColumns = getColumnsToExport({ apiRef, options });

      return buildExcel(
        {
          columns: exportedColumns,
          rowIds: exportedRowIds,
          includeHeaders: options.includeHeaders ?? true,
          includeColumnGroupsHeaders: options.includeColumnGroupsHeaders ?? true,
          valueOptionsSheetName: options?.valueOptionsSheetName || 'Options',
          columnsStyles: options?.columnsStyles,
          exceljsPreProcess: options?.exceljsPreProcess,
          exceljsPostProcess: options?.exceljsPostProcess,
          escapeFormulas: options.escapeFormulas ?? true,
        },
        apiRef,
      );
    },
    [logger, apiRef],
  );

  const exportDataAsExcel = React.useCallback<GridExcelExportApi['exportDataAsExcel']>(
    async (options = {}) => {
      const {
        worker: workerFn,
        exceljsPostProcess,
        exceljsPreProcess,
        columnsStyles,
        includeHeaders,
        getRowsToExport = defaultGetRowsToExport,
        valueOptionsSheetName = 'Options',
        ...cloneableOptions
      } = options;

      const sendExcelToUser = (buffer: any) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        exportAs<GridExportExtension>(blob, 'xlsx', options?.fileName);
      };

      if (!workerFn) {
        apiRef.current.publishEvent('excelExportStateChange', 'pending');

        const workbook = await getDataAsExcel(options);
        if (workbook === null) {
          return;
        }

        const content = await workbook.xlsx.writeBuffer();
        apiRef.current.publishEvent('excelExportStateChange', 'finished');
        sendExcelToUser(content);
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        if (exceljsPostProcess) {
          console.warn(
            [
              `MUI X: The exceljsPostProcess option is not supported when a web worker is used.`,
              'As alternative, pass the callback to the same option in setupExcelExportWebWorker.',
            ].join('\n'),
          );
        }
        if (exceljsPreProcess) {
          console.warn(
            [
              `MUI X: The exceljsPreProcess option is not supported when a web worker is used.`,
              'As alternative, pass the callback to the same option in setupExcelExportWebWorker.',
            ].join('\n'),
          );
        }
      }

      const worker = workerFn();

      apiRef.current.publishEvent('excelExportStateChange', 'pending');

      worker.onmessage = async (event) => {
        sendExcelToUser(event.data);
        apiRef.current.publishEvent('excelExportStateChange', 'finished');
        worker.terminate();
      };

      const exportedRowIds = getRowsToExport({ apiRef });
      const exportedColumns = getColumnsToExport({ apiRef, options });
      const valueOptionsData = await getDataForValueOptionsSheet(
        exportedColumns,
        valueOptionsSheetName,
        apiRef.current,
      );

      const serializedColumns = serializeColumns(exportedColumns, options.columnsStyles || {});

      apiRef.current.resetColSpan();
      const serializedRows = exportedRowIds.map((id) =>
        serializeRowUnsafe(id, exportedColumns, apiRef, valueOptionsData, {
          escapeFormulas: options.escapeFormulas ?? true,
        }),
      );
      apiRef.current.resetColSpan();

      const columnGroupPaths = exportedColumns.reduce<Record<string, string[]>>((acc, column) => {
        acc[column.field] = apiRef.current.getColumnGroupPath(column.field);
        return acc;
      }, {});

      const message: ExcelExportInitEvent = {
        serializedColumns,
        serializedRows,
        valueOptionsData,
        columnGroupPaths,
        columnGroupDetails: apiRef.current.getAllGroupDetails(),
        options: cloneableOptions,
        valueOptionsSheetName,
      };

      worker.postMessage(message);
    },
    [apiRef, getDataAsExcel],
  );

  const excelExportApi: GridExcelExportApi = {
    getDataAsExcel,
    exportDataAsExcel,
  };

  useGridApiMethod(apiRef, excelExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback<GridPipeProcessor<'exportMenu'>>(
    (
      initialValue,
      options: { excelOptions: GridExcelExportOptions & GridExportDisplayOptions },
    ) => {
      if (options.excelOptions?.disableToolbarButton) {
        return initialValue;
      }
      return [
        ...initialValue,
        {
          component: <GridExcelExportMenuItem options={options.excelOptions} />,
          componentName: 'excelExport',
        },
      ];
    },
    [],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);

  useGridApiOptionHandler(apiRef, 'excelExportStateChange', props.onExcelExportStateChange);
};
