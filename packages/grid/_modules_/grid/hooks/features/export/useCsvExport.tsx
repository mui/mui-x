import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { visibleColumnsSelector } from '../columns';
import { visibleSortedRowsSelector } from '../filter';
import { selectionStateSelector } from '../selection';
import { CsvExportApi } from '../../../models';
import { useLogger } from '../../utils/useLogger';
import { exportAs } from '../../../utils';

export const useCsvExport = (apiRef: ApiRef): void => {
  const logger = useLogger('useCsvExport');
  const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedRowsSelector);
  const selection = useGridSelector(apiRef, selectionStateSelector);

  const exportDataAsCsv = React.useCallback((): void => {
    logger.debug(`Export data as CSV`);
    // const csv = buildCSV(visibleColumns, visibleSortedRows, selection);
    // const blob = new Blob([csv], { type: 'text/csv' });

    // exportAs(blob, 'csv', 'data');
    console.log(visibleColumns);
    console.log(visibleSortedRows);
    console.log(selection);
  }, [logger, visibleColumns, visibleSortedRows, selection]);

  const getDataAsCsv = React.useCallback(() => {
    logger.debug(`Get data as CSV`);
    // const csv = buildCSV(visibleColumns, visibleSortedRows, selection);

    // return csv;
  }, [logger, visibleColumns, visibleSortedRows, selection]);

  const csvExportApi: CsvExportApi = {
    exportDataAsCsv,
    getDataAsCsv,
  };

  useApiMethod(apiRef, csvExportApi, 'CsvExportApi');
};
