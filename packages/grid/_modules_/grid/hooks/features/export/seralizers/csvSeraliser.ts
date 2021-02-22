import { GridColumns, GridRowId, GridRowModel } from '../../../../models';

export function buildRow(row: GridRowModel, columns: GridColumns): Array<GridRowModel> {
  const mappedRow: GridRowModel[] = [];
  columns.forEach((column) => column.field !== '__check__' && mappedRow.push(row[column.field]));
  return mappedRow;
}

export function buildCSV(
  columns: GridColumns,
  rows: GridRowModel[],
  selectedRows: Record<GridRowId, boolean>,
): string {
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
}
