import * as React from 'react';
import type { Workbook } from 'exceljs';
import { DataGridProProps } from '../../../models/props/DataGridProProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { allGridColumnsSelector, visibleGridColumnsSelector } from '../columns';
import { gridFilteredSortedRowIdsSelector } from '../filter';
import { GridExcelExportApi } from '../../../models/api/gridExcelExportApi';
import { GridExcelExportOptions, GridCsvGetRowsToExportParams } from '../../../models/gridExport';
import { useGridLogger } from '../../utils/useGridLogger';
import { exportAs } from '../../../utils/exportAs';
import { buildExcel } from './serializers/excelSerializer';
import { GridRowId, GridStateColDef } from '../../../models';

// TODO: import from https://github.com/mui-org/material-ui-x/pull/3671 when merged
const buildError = (message: string | string[]) => {
  let alreadyWarned = false;

  const cleanMessage = Array.isArray(message) ? message.join('\n') : message;

  return () => {
    if (!alreadyWarned) {
      alreadyWarned = true;
      throw new Error(cleanMessage);
    }
  };
};

const defaultGetRowsToExport = ({ apiRef }: GridCsvGetRowsToExportParams): GridRowId[] => {
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef.current.state);
  const selectedRows = apiRef.current.getSelectedRows();

  if (selectedRows.size > 0) {
    return filteredSortedRowIds.filter((id) => selectedRows.has(id));
  }

  return filteredSortedRowIds;
};

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export const useGridExcelExport = (
  apiRef: GridApiRef,
  props: Partial<Pick<DataGridProProps, 'experimentalFeatures'>>,
): void => {
  const featureIsActivated = props?.experimentalFeatures?.excelExport === true;

  const logger = useGridLogger(apiRef, 'useGridExcelExport');
  const inactivatedError = buildError([
    'MUI: export .excel is experimental and must be activated by setting',
    '<DataGridPro experimentalFeatures={{excelExport: true}} />',
  ]);

  const getDataAsExcel = React.useCallback(
    (options: GridExcelExportOptions = {}): Promise<Workbook> => {
      if (!featureIsActivated) {
        inactivatedError();
      }
      logger.debug(`Get data as excel`);
      const columns = allGridColumnsSelector(apiRef.current.state);

      let exportedColumns: GridStateColDef[];
      if (options.fields) {
        exportedColumns = options.fields
          .map((field) => columns.find((column) => column.field === field))
          .filter((column): column is GridStateColDef => !!column);
      } else {
        const validColumns = options.allColumns
          ? columns
          : visibleGridColumnsSelector(apiRef.current.state);
        exportedColumns = validColumns.filter((column) => !column.disableExport);
      }

      const getRowsToExport = options.getRowsToExport ?? defaultGetRowsToExport;
      const exportedRowIds = getRowsToExport({ apiRef });

      return buildExcel(
        {
          columns: exportedColumns,
          rowIds: exportedRowIds,
          getCellParams: apiRef.current.getCellParams,
          includeHeaders: options.includeHeaders ?? true,
        },
        apiRef.current,
      );
    },
    [featureIsActivated, logger, apiRef, inactivatedError],
  );

  const exportDataAsExcel = React.useCallback(
    async (options?: GridExcelExportOptions): Promise<void> => {
      logger.debug(`Export data as excel`);
      if (!featureIsActivated) {
        inactivatedError();
        return;
      }

      const workbook = await getDataAsExcel(options);
      const content = await workbook.xlsx.writeBuffer();
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      exportAs(blob, 'xls', options?.fileName);
    },
    [logger, featureIsActivated, getDataAsExcel, inactivatedError],
  );

  const excelExportApi: GridExcelExportApi = {
    getDataAsExcel,
    exportDataAsExcel,
  };

  useGridApiMethod<GridExcelExportApi>(apiRef, excelExportApi, 'GridExcelExportApi');
};
