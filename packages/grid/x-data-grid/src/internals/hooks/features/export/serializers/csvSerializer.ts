import { GRID_CHECKBOX_SELECTION_COL_DEF, GridRowId, GridCellValue } from '../../../../models';
import { GridCellParams } from '../../../../models/params/gridCellParams';
import { GridStateColDef } from '../../../../models/colDef/gridColDef';

const serialiseCellValue = (value: GridCellValue, delimiterCharacter: string) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');

    // Make sure value containing delimiter or line break won't be splitted into multiple rows
    if ([delimiterCharacter, '\n', '\r'].some((delimiter) => formattedValue.includes(delimiter))) {
      return `"${formattedValue}"`;
    }

    return formattedValue;
  }

  return value;
};

let warnedOnce = false;

const serialiseRow = (
  id: GridRowId,
  columns: GridStateColDef[],
  getCellParams: (id: GridRowId, field: string) => GridCellParams,
  delimiterCharacter: string,
) =>
  columns.map((column) => {
    const cellParams = getCellParams(id, column.field);
    if (process.env.NODE_ENV !== 'production') {
      if (!warnedOnce && String(cellParams.formattedValue) === '[object Object]') {
        console.warn(
          [
            'MUI: When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.',
            'You can provide a `valueFormatter` with a string representation to be used.',
          ].join('\n'),
        );
        warnedOnce = true;
      }
    }
    return serialiseCellValue(cellParams.formattedValue, delimiterCharacter);
  });

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
