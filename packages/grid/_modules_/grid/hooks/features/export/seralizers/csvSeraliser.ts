import { Columns, RowId, RowModel } from '../../../../models';

export function buildRow(row: RowModel, columns: Columns): Array<RowModel> {
  const mappedRow: RowModel[] = [];
  columns.forEach((column) => column.field !== '__check__' && mappedRow.push(row[column.field]));
  return mappedRow;
}

export function buildCSV(
  columns: Columns,
  rows: RowModel[],
  selectedRows: Record<RowId, boolean>,
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
