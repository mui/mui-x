import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridCsvExportApi } from '../../../models/api/gridCsvExportApi';
import { GridCsvExportOptions } from '../../../models/gridExport';
import { useGridLogger } from '../../utils/useGridLogger';
import { exportAs } from '../../../utils/exportAs';
import { buildCSV } from './serializers/csvSerializer';
import { getColumnsToExport, defaultGetRowsToExport } from './utils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import {
  GridExportDisplayOptions,
  GridCsvExportMenuItem,
} from '../../../components/toolbar/GridToolbarExport';

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export const useGridCsvExport = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  const logger = useGridLogger(apiRef, 'useGridCsvExport');

  const getDataAsCsv = React.useCallback(
    (options: GridCsvExportOptions = {}): string => {
      logger.debug(`Get data as CSV`);

      const exportedColumns = getColumnsToExport({
        apiRef,
        options,
      });

      const getRowsToExport = options.getRowsToExport ?? defaultGetRowsToExport;
      const exportedRowIds = getRowsToExport({ apiRef });

      return buildCSV({
        columns: exportedColumns,
        rowIds: exportedRowIds,
        getCellParams: apiRef.current.getCellParams,
        delimiterCharacter: options.delimiter || ',',
        includeHeaders: options.includeHeaders ?? true,
      });
    },
    [logger, apiRef],
  );

  const exportDataAsCsv = React.useCallback<GridCsvExportApi['exportDataAsCsv']>(
    (options): void => {
      logger.debug(`Export data as CSV`);
      const csv = getDataAsCsv(options);

      const blob = new Blob([options?.utf8WithBom ? new Uint8Array([0xef, 0xbb, 0xbf]) : '', csv], {
        type: 'text/csv',
      });

      exportAs(blob, 'csv', options?.fileName);
    },
    [logger, getDataAsCsv],
  );

  const csvExportApi: GridCsvExportApi = {
    getDataAsCsv,
    exportDataAsCsv,
  };

  useGridApiMethod(apiRef, csvExportApi, 'GridCsvExportApi');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback<GridPipeProcessor<'exportMenu'>>(
    (initialValue, options: { csvOptions: GridCsvExportOptions & GridExportDisplayOptions }) => {
      if (options.csvOptions?.disableToolbarButton) {
        return initialValue;
      }
      return [
        ...initialValue,
        {
          component: <GridCsvExportMenuItem options={options.csvOptions} />,
          componentName: 'csvExport',
        },
      ];
    },
    [],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportMenu', addExportMenuButtons);
};
