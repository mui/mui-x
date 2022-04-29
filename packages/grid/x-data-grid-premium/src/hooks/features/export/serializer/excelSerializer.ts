import type * as Excel from 'exceljs';
import {
  GridStateColDef,
  GridRowId,
  GridColDef,
  GridValueFormatterParams,
  GridApi,
  ValueOptions,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
} from '@mui/x-data-grid-pro';
import { buildWarning } from '@mui/x-data-grid/internals';
import { GridExceljsProcessInput, ColumnsStylesInterface } from '../gridExcelExportInterface';

const getExcelJs = () => import('exceljs');

const warnInvalidFormattedValue = buildWarning([
  'MUI: When the value of a field is an object or a `renderCell` is provided, the Excel export might not display the value correctly.',
  'You can provide a `valueFormatter` with a string representation to be used.',
]);

const getFormattedValueOptions = (
  colDef: GridColDef,
  valueOptions: ValueOptions[],
  api: GridApi,
) => {
  if (!colDef.valueOptions) {
    return [];
  }
  let valueOptionsFormatted = valueOptions;

  if (colDef.valueFormatter) {
    valueOptionsFormatted = valueOptionsFormatted.map((option) => {
      if (typeof option === 'object') {
        return option;
      }

      const params: GridValueFormatterParams = { field: colDef.field, api, value: option };
      return String(colDef.valueFormatter!(params));
    });
  }
  return valueOptionsFormatted.map((option) =>
    typeof option === 'object' ? option.label : option,
  );
};

const serializeRow = (
  id: GridRowId,
  columns: GridStateColDef[],
  api: GridApi,
  defaultValueOptionsFormulae: { [field: string]: string },
) => {
  const row: { [colField: string]: undefined | number | boolean | string | Date } = {};
  const dataValidation: { [key: string]: Excel.DataValidation } = {};

  const firstCellParams = api.getCellParams(id, columns[0].field);
  const outlineLevel = firstCellParams.rowNode.depth;

  columns.forEach((column) => {
    const cellParams = api.getCellParams(id, column.field);
    switch (cellParams.colDef.type) {
      case 'singleSelect': {
        if (typeof cellParams.colDef.valueOptions === 'function') {
          // If value option depends on the row, set specific options to the cell
          // This dataValidation is buggy with LibreOffice and does not allow to have coma
          const valueOptions = cellParams.colDef.valueOptions({ id, row, field: cellParams.field });
          const formattedValueOptions = getFormattedValueOptions(
            cellParams.colDef,
            valueOptions,
            api,
          );
          dataValidation[column.field] = {
            type: 'list',
            allowBlank: true,
            formulae: [
              `"${formattedValueOptions
                .map((x) => x.toString().replaceAll(',', 'CHAR(44)'))
                .join(',')}"`,
            ],
          };
        } else {
          // If value option is defined for the column, refer to another sheet
          dataValidation[column.field] = {
            type: 'list',
            allowBlank: true,
            formulae: [defaultValueOptionsFormulae[column.field]],
          };
        }

        const formattedValue = api.getCellParams(id, column.field).formattedValue;
        if (process.env.NODE_ENV !== 'production') {
          if (String(cellParams.formattedValue) === '[object Object]') {
            warnInvalidFormattedValue();
          }
        }
        row[column.field] = formattedValue?.label ?? formattedValue;
        break;
      }
      case 'boolean':
      case 'number':
        row[column.field] = api.getCellParams(id, column.field).value;
        break;
      case 'date':
      case 'dateTime': {
        // Excel does not do any timezone conversion, so we create a date using UTC instead of local timezone
        // Solution from: https://github.com/exceljs/exceljs/issues/486#issuecomment-432557582
        // About Date.UTC(): https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC#exemples
        const date = api.getCellParams(id, column.field).value;
        const utcDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ),
        );
        row[column.field] = utcDate;
        break;
      }
      case 'actions':
        break;
      default:
        row[column.field] = api.getCellParams(id, column.field).formattedValue;
        if (process.env.NODE_ENV !== 'production') {
          if (String(cellParams.formattedValue) === '[object Object]') {
            warnInvalidFormattedValue();
          }
        }
        break;
    }
  });
  return {
    row,
    dataValidation,
    outlineLevel,
  };
};

const defaultColumnsStyles = {
  [GRID_DATE_COL_DEF.type as string]: { numFmt: 'dd.mm.yyyy' },
  [GRID_DATETIME_COL_DEF.type as string]: { numFmt: 'dd.mm.yyyy hh:mm' },
};

const serializeColumn = (column: GridStateColDef, columnsStyles: ColumnsStylesInterface) => {
  const { field, type } = column;

  return {
    key: field,
    // Excel width must stay between 0 and 255 (https://support.microsoft.com/en-us/office/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46)
    // From the example of column width behavior (https://docs.microsoft.com/en-US/office/troubleshoot/excel/determine-column-widths#example-of-column-width-behavior)
    // a value of 10 corresponds to 75px. This is an approximation, because column width depends on the the font-size
    width: Math.min(255, column.width ? column.width / 7.5 : 8.43),
    style: { ...(type && defaultColumnsStyles?.[type]), ...columnsStyles?.[field] },
  };
};

interface BuildExcelOptions {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  includeHeaders: boolean;
  valueOptionsSheetName: string;
  exceljsPreProcess?: (processInput: GridExceljsProcessInput) => Promise<void>;
  exceljsPostProcess?: (processInput: GridExceljsProcessInput) => Promise<void>;
  columnsStyles?: ColumnsStylesInterface;
}

export async function buildExcel(
  options: BuildExcelOptions,
  api: GridApi,
): Promise<Excel.Workbook> {
  const {
    columns,
    rowIds,
    includeHeaders,
    valueOptionsSheetName,
    exceljsPreProcess,
    exceljsPostProcess,
    columnsStyles = {},
  } = options;

  const excelJS = await getExcelJs();
  const workbook: Excel.Workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columns.map((column) => serializeColumn(column, columnsStyles));

  if (exceljsPreProcess) {
    await exceljsPreProcess({
      workbook,
      worksheet,
    });
  }

  if (includeHeaders) {
    worksheet.addRow(columns.map((column) => column.headerName || column.field));
  }

  const columnsWithArrayValueOptions = columns.filter(
    (column) =>
      column.type === 'singleSelect' &&
      column.valueOptions &&
      typeof column.valueOptions !== 'function',
  );
  const defaultValueOptionsFormulae: { [field: string]: string } = {};

  if (columnsWithArrayValueOptions.length) {
    const valueOptionsWorksheet = workbook.addWorksheet(valueOptionsSheetName);

    valueOptionsWorksheet.columns = columnsWithArrayValueOptions.map(({ field }) => ({
      key: field,
    }));
    columnsWithArrayValueOptions.forEach((column) => {
      const formattedValueOptions = getFormattedValueOptions(
        column,
        column.valueOptions as ValueOptions[],
        api,
      );
      valueOptionsWorksheet.getColumn(column.field).values = [
        column.headerName || column.field,
        ...formattedValueOptions,
      ];

      const columnLetter = valueOptionsWorksheet.getColumn(column.field).letter;
      defaultValueOptionsFormulae[
        column.field
      ] = `${valueOptionsSheetName}!$${columnLetter}$2:$${columnLetter}$${
        1 + formattedValueOptions.length
      }`;
    });
  }

  rowIds.forEach((id) => {
    const { row, dataValidation, outlineLevel } = serializeRow(
      id,
      columns,
      api,
      defaultValueOptionsFormulae,
    );
    const newRow = worksheet.addRow(row);

    Object.keys(dataValidation).forEach((field) => {
      newRow.getCell(field).dataValidation = {
        ...dataValidation[field],
      };
    });

    if (outlineLevel) {
      newRow.outlineLevel = outlineLevel;
    }
  });

  if (exceljsPostProcess) {
    await exceljsPostProcess({
      workbook,
      worksheet,
    });
  }

  return workbook;
}
