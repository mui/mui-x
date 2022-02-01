import type * as Excel from 'exceljs';
import {
  GridCellParams,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridStateColDef,
  GridRowId,
  GridColDef,
  GridValueOptionsParams,
  GridValueFormatterParams,
  GridApi,
} from '../../../../models';

const getExcelJs = () => import('exceljs');

const getFormattedValueOptions = (
  colDef: GridColDef,
  { id, row, field }: GridValueOptionsParams,
  api: GridApi,
) => {
  // TODO: clean depending on the solution chosen for https://github.com/mui-org/material-ui-x/issues/3806
  if (!colDef.valueOptions) {
    return [];
  }
  let valueOptionsFormatted;
  if (typeof colDef.valueOptions === 'function') {
    valueOptionsFormatted = colDef.valueOptions({ id, row, field });
  } else {
    valueOptionsFormatted = colDef.valueOptions;
  }

  if (colDef.valueFormatter) {
    valueOptionsFormatted = valueOptionsFormatted.map((option) => {
      if (typeof option === 'object') {
        return option;
      }

      const params: GridValueFormatterParams = { field, api, value: option };
      return String(colDef.valueFormatter(params));
    });
  }
  return valueOptionsFormatted.map((option) =>
    typeof option === 'object' ? option.label : option,
  );
};

const serialiseRow = (
  id: GridRowId,
  columns: GridStateColDef[],
  getCellParams: (id: GridRowId, field: string) => GridCellParams,
  api: GridApi,
) => {
  const row = {};
  const dataValidation = {};

  columns.forEach((column) => {
    const cellParams = getCellParams(id, column.field);
    switch (cellParams.colDef.type) {
      case 'singleSelect': {
        const valueOptions: GridValueOptionsParams = {
          id: cellParams.id,
          row: cellParams.row,
          field: cellParams.field,
        };
        const formattedValueOptions = getFormattedValueOptions(
          cellParams.colDef,
          valueOptions,
          api,
        );
        dataValidation[column.field] = {
          type: 'list',
          allowBlank: true,
          formulae: [formattedValueOptions.map((x) => `"${x}"`)],
        };
        const formattedValue = getCellParams(id, column.field).formattedValue;
        row[column.field] =
          typeof formattedValue === 'object' ? formattedValue.label : formattedValue;
        break;
      }
      case 'boolean':
      case 'number':
      case 'date':
      case 'dateTime':
        row[column.field] = getCellParams(id, column.field).value;
        break;
      case 'actions':
        break;
      default:
        row[column.field] = getCellParams(id, column.field).formattedValue;
        break;
    }
  });
  return {
    row,
    dataValidation,
  };
};

const serialiseColumn = (column: GridColDef, includeHeaders: boolean) => {
  const { field, headerName } = column;

  return {
    ...(includeHeaders ? { header: headerName || field } : {}),
    key: field,
    // TODO
    // the width seems to be the number of small character visible in a cell
    // could be nice to move from px width to excel width
    width: column.width || 20,
  };
};

interface BuildExcelOptions {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  includeHeaders: boolean;
}

export async function buildExcel(options: BuildExcelOptions, api): Promise<Excel.Workbook> {
  const { columns, rowIds, getCellParams, includeHeaders } = options;

  const columnsWithoutCheckbox = columns.filter(
    (column) => column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field,
  );

  const excelJS = await getExcelJs();
  const workbook: Excel.Workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columnsWithoutCheckbox.map((column) =>
    serialiseColumn(column, includeHeaders),
  );

  rowIds.forEach((id) => {
    const { row, dataValidation } = serialiseRow(id, columnsWithoutCheckbox, getCellParams, api);
    const newRows = worksheet.addRow(row);

    Object.keys(dataValidation).forEach((field) => {
      newRows.getCell(field).dataValidation = {
        ...dataValidation[field],
      };
    });
  });
  return workbook;
}
