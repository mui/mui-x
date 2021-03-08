import {
  GridCellValue,
  gridCheckboxSelectionColDef,
  GridColumns,
  GridRowId,
  GridRowModel,
} from '../../../../models';

const serialiseCellValue = (value) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(',') ? `"${formattedValue}"` : formattedValue;
  }
  return value;
};

export function serialiseRow(
  row: GridRowModel,
  columns: GridColumns,
  getCellValue: (id: GridRowId, field: string) => GridCellValue,
): Array<string> {
  const mappedRow: string[] = [];
  columns.forEach(
    (column) =>
      column.field !== gridCheckboxSelectionColDef.field &&
      mappedRow.push(serialiseCellValue(getCellValue(row.id, column.field))),
  );
  return mappedRow;
}

export function buildCSV(
  columns: GridColumns,
  rows: GridRowModel[],
  selectedRows: Record<GridRowId, boolean>,
  getCellValue: (id: GridRowId, field: string) => GridCellValue,
): string {
  const selectedRowsIds = Object.keys(selectedRows);

  if (selectedRowsIds.length) {
    rows = rows.filter((row) => selectedRowsIds.includes(`${row.id}`));
  }

  const CSVHead = `${columns
    .filter((column) => column.field !== gridCheckboxSelectionColDef.field)
    .map((column) => serialiseCellValue(column.headerName || column.field))
    .toString()}\r\n`;
  const CSVBody = rows
    .reduce((soFar, row) => `${soFar}${serialiseRow(row, columns, getCellValue)}\r\n`, '')
    .trim();
  const csv = `${CSVHead}${CSVBody}`.trim();

  return csv;
}
