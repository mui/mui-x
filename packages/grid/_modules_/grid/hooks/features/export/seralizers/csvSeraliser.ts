import {
  GridCellValue,
  gridCheckboxSelectionColDef,
  GridColumns,
  GridRowId,
  GridRowModel,
} from '../../../../models';
import { GridExportCsvDelimiter } from '../../../../models/gridExport';

const serialiseCellValue = (value: any, delimiterCharacter: GridExportCsvDelimiter) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(delimiterCharacter) ? `"${formattedValue}"` : formattedValue;
  }

  return value;
};

export function serialiseRow(
  id: GridRowId,
  columns: GridColumns,
  getCellValue: (id: GridRowId, field: string) => GridCellValue,
  delimiterCharacter: GridExportCsvDelimiter,
): Array<string> {
  const mappedRow: string[] = [];
  columns.forEach(
    (column) =>
      column.field !== gridCheckboxSelectionColDef.field &&
      mappedRow.push(serialiseCellValue(getCellValue(id, column.field), delimiterCharacter)),
  );
  return mappedRow;
}

interface BuildCSVOptions {
  columns: GridColumns;
  rows: Map<GridRowId, GridRowModel>;
  selectedRows: Record<string, GridRowId>;
  getCellValue: (id: GridRowId, field: string) => GridCellValue;
  delimiterCharacter: GridExportCsvDelimiter;
}

export function buildCSV(options: BuildCSVOptions): string {
  const { columns, rows, selectedRows, getCellValue, delimiterCharacter } = options;
  let rowIds = [...rows.keys()];
  const selectedRowIds = Object.keys(selectedRows);

  if (selectedRowIds.length) {
    rowIds = rowIds.filter((id) => selectedRowIds.includes(`${id}`));
  }

  const CSVHead = `${columns
    .filter((column) => column.field !== gridCheckboxSelectionColDef.field)
    .map((column) => serialiseCellValue(column.headerName || column.field, delimiterCharacter))
    .join(delimiterCharacter)}\r\n`;
  const CSVBody = rowIds
    .reduce<string>(
      (acc, id) =>
        `${acc}${serialiseRow(id, columns, getCellValue, delimiterCharacter).join(
          delimiterCharacter,
        )}\r\n`,
      '',
    )
    .trim();
  const csv = `${CSVHead}${CSVBody}`.trim();

  return csv;
}
