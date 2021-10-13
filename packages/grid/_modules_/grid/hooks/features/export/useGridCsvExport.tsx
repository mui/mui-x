import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridSelector } from '../../utils/useGridSelector';
import { allGridColumnsSelector, visibleGridColumnsSelector } from '../columns';
import { gridSortedVisibleRowEntriesSelector } from '../filter';
import { gridSelectionStateSelector } from '../selection';
import { GridCsvExportApi } from '../../../models/api/gridCsvExportApi';
import { GridCsvExportOptions } from '../../../models/gridExport';
import { useGridLogger } from '../../utils/useGridLogger';
import { exportAs } from '../../../utils/exportAs';
import { buildCSV } from './serializers/csvSerializer';
import { GridStateColDef } from '../../../models';

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export const useGridCsvExport = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridCsvExport');
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleSortedRows = useGridSelector(apiRef, gridSortedVisibleRowEntriesSelector);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);

  const getDataAsCsv = React.useCallback(
    (options?: GridCsvExportOptions): string => {
      logger.debug(`Get data as CSV`);

      let exportedColumns: GridStateColDef[];

      if (options?.fields) {
        exportedColumns = options.fields
          .map((field) => columns.find((column) => column.field === field))
          .filter((column): column is GridStateColDef => !!column);
      } else {
        const validColumns = options?.allColumns ? columns : visibleColumns;

        exportedColumns = validColumns.filter((column) => !column.disableExport);
      }

      let exportedRowIds = visibleSortedRows.map((el) => el.id);
      if (selection.length) {
        exportedRowIds = exportedRowIds.filter((id) => selection.includes(id));
      }

      return buildCSV({
        columns: exportedColumns,
        rowIds: exportedRowIds,
        getCellParams: apiRef.current.getCellParams,
        delimiterCharacter: options?.delimiter || ',',
      });
    },
    [logger, visibleColumns, columns, visibleSortedRows, selection, apiRef],
  );

  const exportDataAsCsv = React.useCallback(
    (options?: GridCsvExportOptions): void => {
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
