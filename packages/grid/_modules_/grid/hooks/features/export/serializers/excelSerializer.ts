import type * as Excel from 'exceljs';
import {
  GridCellParams,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridStateColDef,
  GridRowId,
  GridColDef,
} from '../../../../models';

const getExcelJs = () => import('exceljs');

const serialiseRow = (
  id: GridRowId,
  columns: GridStateColDef[],
  getCellParams: (id: GridRowId, field: string) => GridCellParams,
) => columns.map((column) => getCellParams(id, column.field).formattedValue);

const serialiseColumn = (column: GridColDef, includeHeaders: boolean) => {
  const { field, headerName } = column;

  return {
    ...(includeHeaders ? { header: headerName || field } : {}),
    key: field,
  };
};

interface BuildExcelOptions {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  includeHeaders: boolean;
}

export async function buildExcel(options: BuildExcelOptions): Promise<Excel.Workbook> {
  const { columns, rowIds, getCellParams, includeHeaders } = options;

  const columnsWithoutCheckbox = columns.filter(
    (column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field,
  );

  const excelJS = await getExcelJs();
  const workbook: Excel.Workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columnsWithoutCheckbox.map((column) =>
    serialiseColumn(column, includeHeaders),
  );

  rowIds.forEach((id) => {
    const row = serialiseRow(id, columnsWithoutCheckbox, getCellParams);
    worksheet.addRow(row);
  });
  return workbook;
}
