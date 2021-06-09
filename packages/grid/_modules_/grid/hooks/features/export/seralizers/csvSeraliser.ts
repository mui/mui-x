import {
  GridCellValue,
  gridCheckboxSelectionColDef,
  GridColumns,
  GridRowId,
  GridRowModel,
} from '../../../../models';

import { CsvDelimiterCharacter } from '../../../../models/gridExport';

const serialiseCellValue = (
  value: any,
  delimiterCharacter: CsvDelimiterCharacter,
  commaAsDecimalSeparator: boolean,
) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(delimiterCharacter) ? `"${formattedValue}"` : formattedValue;
  }

  if (typeof value === 'number' && commaAsDecimalSeparator) {
    return value.toString().replace('.', ',');
  }

  return value;
};

export function serialiseRow(
  id: GridRowId,
  columns: GridColumns,
  getCellValue: (id: GridRowId, field: string) => GridCellValue,
  delimiterCharacter: CsvDelimiterCharacter,
  commaAsDecimalSeparator: boolean,
): Array<string> {
  const mappedRow: string[] = [];
  columns.forEach(
    (column) =>
      column.field !== gridCheckboxSelectionColDef.field &&
      mappedRow.push(
        serialiseCellValue(
          getCellValue(id, column.field),
          delimiterCharacter,
          commaAsDecimalSeparator,
        ),
      ),
  );
  return mappedRow;
}

export function buildCSV(
  columns: GridColumns,
  rows: Map<GridRowId, GridRowModel>,
  selectedRows: Record<string, GridRowId>,
  getCellValue: (id: GridRowId, field: string) => GridCellValue,
  delimiterCharacter: CsvDelimiterCharacter = ',',
  commaAsDecimalSeparator: boolean = false,
): string {
  let rowIds = [...rows.keys()];
  const selectedRowIds = Object.keys(selectedRows);

  if (selectedRowIds.length) {
    rowIds = rowIds.filter((id) => selectedRowIds.includes(`${id}`));
  }

  if (commaAsDecimalSeparator && delimiterCharacter === ',') {
    delimiterCharacter = ';';
  }

  const CSVHead = `${columns
    .filter((column) => column.field !== gridCheckboxSelectionColDef.field)
    .map((column) =>
      serialiseCellValue(
        column.headerName || column.field,
        delimiterCharacter,
        commaAsDecimalSeparator,
      ),
    )
    .join(delimiterCharacter)}\r\n`;
  const CSVBody = rowIds
    .reduce<string>(
      (acc, id) =>
        `${acc}${serialiseRow(
          id,
          columns,
          getCellValue,
          delimiterCharacter,
          commaAsDecimalSeparator,
        ).join(delimiterCharacter)}\r\n`,
      '',
    )
    .trim();
  const csv = `${CSVHead}${CSVBody}`.trim();

  return csv;
}
