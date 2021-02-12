import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useGridSelector } from '../core/useGridSelector';
import { visibleColumnsSelector } from '../columns';
import { visibleSortedRowsSelector } from '../filter';
import { selectionStateSelector } from '../selection';
import { Columns, CsvExportApi, RowId, RowModel } from '../../../models';
import { useLogger } from '../../utils/useLogger';
import { exportAs } from '../../../utils';

const buildRow = (row: RowModel, columns: Columns) => {
  const mappedRow: RowModel[] = [];
  columns.forEach((column) => column.field !== '__check__' && mappedRow.push(row[column.field]));
  return mappedRow;
};

const buildCSV = (columns: Columns, rows: RowModel[], selectedRows: Record<RowId, boolean>) => {
  const selectedRowsIds = Object.keys(selectedRows);

  if (selectedRowsIds.length) {
    rows = rows.filter((row) => selectedRowsIds.includes(`${row.id}`));
  }

  const CSVHead = `${columns
    .filter((column) => column.field !== '__check__')
    .map((column) => column.headerName)
    .toString()}\r\n`;
  const CSVBody = rows.reduce((soFar, row) => `${soFar}${buildRow(row, columns)}\r\n`, '').trim();
  const csv = `${CSVHead}${CSVBody}`.trim();

  return csv;
};

export const useCsvExport = (apiRef: ApiRef): void => {
  const logger = useLogger('useCsvExport');
  const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
  const visibleSortedRows = useGridSelector(apiRef, visibleSortedRowsSelector);
  const selection = useGridSelector(apiRef, selectionStateSelector);

  const exportDataAsCsv = React.useCallback((): void => {
    logger.debug(`Export data as CSV`);
    const csv = buildCSV(visibleColumns, visibleSortedRows, selection);
    const blob = new Blob([csv], { type: 'text/csv' });

    exportAs(blob, 'csv', 'data');
  }, [logger, visibleColumns, visibleSortedRows, selection]);

  const getDataAsCsv = React.useCallback(() => {
    logger.debug(`Get data as CSV`);
    const csv = buildCSV(visibleColumns, visibleSortedRows, selection);

    return csv;
  }, [logger, visibleColumns, visibleSortedRows, selection]);

  const csvExportApi: CsvExportApi = {
    exportDataAsCsv,
    getDataAsCsv,
  };

  useApiMethod(apiRef, csvExportApi, 'CsvExportApi');
};
