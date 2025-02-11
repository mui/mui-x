import type * as Excel from 'exceljs';
import type { GridExcelExportOptions } from '../gridExcelExportInterface';
import {
  addColumnGroupingHeaders,
  addSerializedRowToWorksheet,
  createValueOptionsSheetIfNeeded,
  ExcelExportInitEvent,
  getExcelJs,
} from './utils';

export function setupExcelExportWebWorker(
  workerOptions: Pick<GridExcelExportOptions, 'exceljsPostProcess' | 'exceljsPreProcess'> = {},
) {
  // eslint-disable-next-line no-restricted-globals
  addEventListener('message', async (event: MessageEvent<ExcelExportInitEvent>) => {
    const {
      serializedColumns,
      serializedRows,
      options,
      valueOptionsSheetName,
      valueOptionsData,
      columnGroupDetails,
      columnGroupPaths,
    } = event.data;

    const { exceljsPostProcess, exceljsPreProcess } = workerOptions;

    const excelJS = await getExcelJs();
    const workbook: Excel.Workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = serializedColumns;

    if (exceljsPreProcess) {
      await exceljsPreProcess({ workbook, worksheet });
    }

    if (options.includeColumnGroupsHeaders) {
      addColumnGroupingHeaders(worksheet, serializedColumns, columnGroupPaths, columnGroupDetails);
    }

    const includeHeaders = options.includeHeaders ?? true;
    if (includeHeaders) {
      worksheet.addRow(serializedColumns.map((column) => column.headerText));
    }

    createValueOptionsSheetIfNeeded(valueOptionsData, valueOptionsSheetName, workbook);

    serializedRows.forEach((serializedRow) => {
      addSerializedRowToWorksheet(serializedRow, worksheet);
    });

    if (exceljsPostProcess) {
      await exceljsPostProcess({ workbook, worksheet });
    }

    postMessage(await workbook.xlsx.writeBuffer());
  });
}
