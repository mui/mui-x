import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { visibleColumnsSelector } from '../columns';
import { visibleSortedRowsSelector } from '../filter';
import { selectionStateSelector } from '../selection';
import { GridCsvExportApi } from '../../../models';
import { useLogger } from '../../utils/useLogger';
import { exportAs } from '../../../utils';
import { buildCSV } from './seralizers/csvSeraliser';

export const useGridCsvExport = (apiRef: ApiRef): void => {
  const logger = useLogger('useGridCsvExport');
  const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedRowsSelector);
  const selection = useGridSelector(apiRef, selectionStateSelector);

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

  useApiMethod(apiRef, csvExportApi, 'GridCsvExportApi');
};
