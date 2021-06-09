import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridColumnsSelector } from '../columns';
import { visibleSortedGridRowsSelector } from '../filter';
import { gridSelectionStateSelector } from '../selection';
import { GridCsvExportApi } from '../../../models/api/gridCsvExportApi';
import { GridExportCsvOptions } from '../../../models/gridExport';
import { useLogger } from '../../utils/useLogger';
import { exportAs } from '../../../utils';
import { buildCSV } from './seralizers/csvSeraliser';

export const useGridCsvExport = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridCsvExport');
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedGridRowsSelector);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);

  const getDataAsCsv = React.useCallback(
    (options?: GridExportCsvOptions): string => {
      logger.debug(`Get data as CSV`);

      return buildCSV(
        visibleColumns,
        visibleSortedRows,
        selection,
        apiRef.current.getCellValue,
        options?.delimiter,
      );
    },
    [logger, visibleColumns, visibleSortedRows, selection, apiRef],
  );

  const exportDataAsCsv = React.useCallback(
    (options?: GridExportCsvOptions): void => {
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
};
