import {
  GridCellParams,
  gridCheckboxSelectionColDef,
  GridStateColDef,
  GridRowId,
  GridRowModel,
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
      column.field !== gridCheckboxSelectionColDef.field &&
      mappedRow.push(
        serialiseCellValue(getCellParams(id, column.field).formattedValue, delimiterCharacter),
      ),
  );
  return mappedRow;
}

interface BuildCSVOptions {
  columns: GridStateColDef[];
  rows: Map<GridRowId, GridRowModel>;
  selectedRowIds: GridRowId[];
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  delimiterCharacter: string;
  includeHeaders?: boolean;
}

export function buildCSV(options: BuildCSVOptions): string {
  const {
    columns,
    rows,
    selectedRowIds,
    getCellParams,
    delimiterCharacter,
    includeHeaders = true,
  } = options;
  let rowIds = [...rows.keys()];

  if (selectedRowIds.length) {
    rowIds = rowIds.filter((id) => selectedRowIds.includes(id));
  }

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
    .filter((column) => column.field !== gridCheckboxSelectionColDef.field)
    .map((column) => serialiseCellValue(column.headerName || column.field, delimiterCharacter))
    .join(delimiterCharacter)}\r\n`;

  return `${CSVHead}${CSVBody}`.trim();
}
