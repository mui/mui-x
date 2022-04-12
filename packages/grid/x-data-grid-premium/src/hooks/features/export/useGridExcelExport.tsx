import * as React from 'react';
import { useGridApiMethod, useGridLogger, GridExportDisplayOptions } from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  exportAs,
  getColumnsToExport,
  defaultGetRowsToExport,
  GridPipeProcessor,
} from '@mui/x-data-grid/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  GridExcelExportApi,
  GridExportExtension,
  GridExcelExportOptions,
} from './gridExcelExportInterface';
import { buildExcel } from './serializer/excelSerializer';
import { GridExcelExportMenuItem } from '../../../components';

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export const useGridExcelExport = (apiRef: React.MutableRefObject<GridApiPremium>): void => {
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
          valueOptionsSheetName: options?.valueOptionsSheetName || 'Options',
          columnsStyles: options?.columnsStyles,
          exceljsPreProcess: options?.exceljsPreProcess,
          exceljsPostProcess: options?.exceljsPostProcess,
        },
        apiRef.current,
      );
    },
    [logger, apiRef],
  );

  const exportDataAsExcel = React.useCallback<GridExcelExportApi['exportDataAsExcel']>(
    async (options) => {
      logger.debug(`Export data as excel`);

      const workbook = await getDataAsExcel(options);
      if (workbook === null) {
        return;
      }
      const content = await workbook.xlsx.writeBuffer();
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      exportAs<GridExportExtension>(blob, 'xlsx', options?.fileName);
    },
    [logger, getDataAsExcel],
  );

  const excelExportApi: GridExcelExportApi = {
    getDataAsExcel,
    exportDataAsExcel,
  };

  useGridApiMethod(apiRef, excelExportApi, 'GridExcelExportApi');

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
};
