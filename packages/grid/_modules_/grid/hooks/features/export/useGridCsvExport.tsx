import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridColumnsSelector } from '../columns';
import { visibleSortedGridRowsSelector } from '../filter';
import { gridSelectionStateSelector } from '../selection';
import { GridCsvExportApi } from '../../../models';
import { useLogger } from '../../utils/useLogger';
import { exportAs } from '../../../utils';
import { buildCSV } from './seralizers/csvSeraliser';

export const useGridCsvExport = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridCsvExport');
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedGridRowsSelector);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);

  const getDataAsCsv = React.useCallback((): string => {
    logger.debug(`Get data as CSV`);

    return buildCSV(visibleColumns, visibleSortedRows, selection);
  }, [logger, visibleColumns, visibleSortedRows, selection]);

  const exportDataAsCsv = React.useCallback((): void => {
    logger.debug(`Export data as CSV`);
    const csv = getDataAsCsv();
    const blob = new Blob([csv], { type: 'text/csv' });

    exportAs(blob, 'csv', 'data');
  }, [logger, getDataAsCsv]);

  const csvExportApi: GridCsvExportApi = {
    getDataAsCsv,
    exportDataAsCsv,
  };

  useGridApiMethod(apiRef, csvExportApi, 'GridCsvExportApi');
};
