import {
  GridCellParams,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridStateColDef,
  GridRowId,
  GridCellValue,
} from '../../../../models';

const serialiseCellValue = (value: GridCellValue, delimiterCharacter: string) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(delimiterCharacter) ? `"${formattedValue}"` : formattedValue;
  }

  return value;
};

const serialiseRow = (
  id: GridRowId,
  columns: GridStateColDef[],
  getCellParams: (id: GridRowId, field: string) => GridCellParams,
  delimiterCharacter: string,
) =>
  columns.map((column) =>
    serialiseCellValue(getCellParams(id, column.field).formattedValue, delimiterCharacter),
  );

interface BuildCSVOptions {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  delimiterCharacter: string;
  includeHeaders: boolean;
}

export function buildCSV(options: BuildCSVOptions): string {
  const { columns, rowIds, getCellParams, delimiterCharacter, includeHeaders } = options;

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
