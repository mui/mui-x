import {
  GridCellParams,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridStateColDef,
  GridRowId,
} from '../../../../models';

const serialiseCellValue = (value: any, delimiterCharacter: string) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(delimiterCharacter) ? `"${formattedValue}"` : formattedValue;
  }

  return value;
};

export function serialiseRow(
  id: GridRowId,
  columns: GridStateColDef[],
  getCellParams: (id: GridRowId, field: string) => GridCellParams,
  delimiterCharacter: string,
): Array<string> {
  const mappedRow: string[] = [];
  columns.forEach(
    (column) =>
      column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field &&
      mappedRow.push(
        serialiseCellValue(getCellParams(id, column.field).formattedValue, delimiterCharacter),
      ),
  );
  return mappedRow;
}

interface BuildCSVOptions {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  delimiterCharacter: string;
  includeHeaders?: boolean;
}

export function buildCSV(options: BuildCSVOptions): string {
  const { columns, rowIds, getCellParams, delimiterCharacter, includeHeaders = true } = options;
  const CSVBody = rowIds
    .reduce<string>(
      (acc, id) =>
        `${acc}${serialiseRow(id, columns, getCellParams, delimiterCharacter).join(
          delimiterCharacter,
        )}\r\n`,
      '',
    )
    .trim();

  if (!includeHeaders) {
    return CSVBody;
  }

  const CSVHead = `${columns
    .filter((column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field)
    .map((column) => serialiseCellValue(column.headerName || column.field, delimiterCharacter))
    .join(delimiterCharacter)}\r\n`;

  return `${CSVHead}${CSVBody}`.trim();
}
