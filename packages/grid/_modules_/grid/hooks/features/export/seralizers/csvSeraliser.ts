import { GridColumns, GridRowId, GridRowModel } from '../../../../models';

const formatCellValue = (value) => {
  if (typeof value === 'string') {
    return value.includes(',') ? `"${value}"` : value;
  }
  return value;
};

export function buildRow(row: GridRowModel, columns: GridColumns): Array<string> {
  const mappedRow: string[] = [];
  columns.forEach(
    (column) => column.field !== '__check__' && mappedRow.push(formatCellValue(row[column.field])),
  );
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
    .map((column) => formatCellValue(column.headerName))
    .toString()}\r\n`;
  const CSVBody = rows.reduce((soFar, row) => `${soFar}${buildRow(row, columns)}\r\n`, '').trim();
  const csv = `${CSVHead}${CSVBody}`.trim();

  return csv;
}
