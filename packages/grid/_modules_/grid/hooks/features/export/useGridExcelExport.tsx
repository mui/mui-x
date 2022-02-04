import * as React from 'react';
import type { Workbook } from 'exceljs';
import { DataGridProProps } from '../../../models/props/DataGridProProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridExcelExportApi } from '../../../models/api/gridExcelExportApi';
import { GridExcelExportOptions } from '../../../models/gridExport';
import { useGridLogger } from '../../utils/useGridLogger';
import { exportAs } from '../../../utils/exportAs';
import { buildExcel } from './serializers/excelSerializer';
import { defaultGetRowsToExport, getColumns } from './utils';

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

      const getRowsToExport = options.getRowsToExport ?? defaultGetRowsToExport;
      const exportedRowIds = getRowsToExport({ apiRef });

      const exportedColumns = getColumns({ apiRef, options });

      return buildExcel(
        {
          columns: exportedColumns,
          rowIds: exportedRowIds,
          getCellParams: apiRef.current.getCellParams,
          includeHeaders: options.includeHeaders ?? true,
          exceljsPreprocess: options?.exceljsPreprocess,
          exceljsPostprocess: options?.exceljsPostprocess,
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
