import type * as Excel from '@mui/x-internal-exceljs-fork';
import type { ChartExcelTable } from './chartExcelData.types';
import { DEFAULT_SHEET_NAMES, sanitizeSheetName } from './sheetName';

/** Lazy so exceljs never reaches the bundle of a chart that is not exported. */
const getExcelJs = async () => {
  const excelJsModule = await import('@mui/x-internal-exceljs-fork');
  return excelJsModule.default ?? excelJsModule;
};

export interface BuildChartExcelWorkbookOptions {
  /**
   * Write a header row on each sheet.
   * @default true
   */
  includeHeaders?: boolean;
}

/**
 * Writes tidy tables into a workbook, one worksheet per table.
 *
 * Returns the workbook without serializing it, so callers choose whether to download it
 * and tests can read cells straight off the exceljs objects. `null` when there is nothing
 * to export, since a workbook with no worksheet cannot be written.
 */
export async function buildChartExcelWorkbook(
  tables: ChartExcelTable[],
  options: BuildChartExcelWorkbookOptions = {},
): Promise<Excel.Workbook | null> {
  if (tables.length === 0) {
    return null;
  }

  const { includeHeaders = true } = options;
  const ExcelJS = await getExcelJs();
  const workbook = new ExcelJS.Workbook();
  const usedSheetNames = new Set<string>();

  for (const table of tables) {
    const sheetName = sanitizeSheetName(DEFAULT_SHEET_NAMES[table.id], usedSheetNames);
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = table.columns.map((column) => ({
      key: column.key,
      header: includeHeaders ? column.header : undefined,
      style: column.numFmt ? { numFmt: column.numFmt } : undefined,
    }));

    for (const row of table.rows) {
      worksheet.addRow(row);
    }
  }

  return workbook;
}
