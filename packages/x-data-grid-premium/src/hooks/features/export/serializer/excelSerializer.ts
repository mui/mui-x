import type * as Excel from 'exceljs';
import { RefObject } from '@mui/x-internals/types';
import {
  GridRowId,
  GridColDef,
  GridApi,
  ValueOptions,
  GRID_DATE_COL_DEF,
  GRID_DATETIME_COL_DEF,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import {
  GridStateColDef,
  GridSingleSelectColDef,
  isObject,
  isSingleSelectColDef,
  gridHasColSpanSelector,
} from '@mui/x-data-grid/internals';
import { warnOnce } from '@mui/x-internals/warning';
import { ColumnsStylesInterface, GridExcelExportOptions } from '../gridExcelExportInterface';
import { GridPrivateApiPremium } from '../../../../models/gridApiPremium';
import {
  addColumnGroupingHeaders,
  addSerializedRowToWorksheet,
  createValueOptionsSheetIfNeeded,
  getExcelJs,
  SerializedColumns,
  SerializedRow,
  ValueOptionsData,
} from './utils';

export type { ExcelExportInitEvent } from './utils';

const getFormattedValueOptions = (
  colDef: GridSingleSelectColDef,
  row: GridValidRowModel,
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

      return String(colDef.valueFormatter!(option as never, row, colDef, { current: api }));
    });
  }
  return valueOptionsFormatted.map((option) =>
    typeof option === 'object' ? option.label : option,
  );
};

/**
 * FIXME: This function mutates the colspan info, but colspan info assumes that the columns
 * passed to it are always consistent. In this case, the exported columns may differ from the
 * actual rendered columns.
 * The caller of this function MUST call `resetColSpan()` before and after usage.
 */
export const serializeRowUnsafe = (
  id: GridRowId,
  columns: GridStateColDef[],
  apiRef: RefObject<GridPrivateApiPremium>,
  defaultValueOptionsFormulae: { [field: string]: { address: string } },
  options: Pick<BuildExcelOptions, 'escapeFormulas'>,
): SerializedRow => {
  const row: SerializedRow['row'] = {};
  const dataValidation: SerializedRow['dataValidation'] = {};
  const mergedCells: SerializedRow['mergedCells'] = [];

  const firstCellParams = apiRef.current.getCellParams(id, columns[0].field);
  const outlineLevel = firstCellParams.rowNode.depth;
  const hasColSpan = gridHasColSpanSelector(apiRef);

  if (hasColSpan) {
    // `colSpan` is only calculated for rendered rows, so we need to calculate it during export for every row
    apiRef.current.calculateColSpan({
      rowId: id,
      minFirstColumn: 0,
      maxLastColumn: columns.length,
      columns,
    });
  }

  columns.forEach((column, colIndex) => {
    const colSpanInfo = hasColSpan
      ? apiRef.current.unstable_getCellColSpanInfo(id, colIndex)
      : undefined;
    if (colSpanInfo && colSpanInfo.spannedByColSpan) {
      return;
    }
    if (colSpanInfo && colSpanInfo.cellProps.colSpan > 1) {
      mergedCells.push({
        leftIndex: colIndex + 1,
        rightIndex: colIndex + colSpanInfo.cellProps.colSpan,
      });
    }

    const cellParams = apiRef.current.getCellParams(id, column.field);

    let cellValue: string | undefined;

    switch (cellParams.colDef.type) {
      case 'singleSelect': {
        const castColumn = cellParams.colDef as GridSingleSelectColDef;
        if (typeof castColumn.valueOptions === 'function') {
          // If value option depends on the row, set specific options to the cell
          // This dataValidation is buggy with LibreOffice and does not allow to have coma
          const valueOptions = castColumn.valueOptions({
            id,
            row,
            field: cellParams.field,
          });
          const formattedValueOptions = getFormattedValueOptions(
            castColumn,
            row,
            valueOptions,
            apiRef.current,
          );
          dataValidation[castColumn.field] = {
            type: 'list',
            allowBlank: true,
            formulae: [
              `"${formattedValueOptions
                .map((x) => x.toString().replaceAll(',', 'CHAR(44)'))
                .join(',')}"`,
            ],
          };
        } else {
          const address = defaultValueOptionsFormulae[column.field].address;

          // If value option is defined for the column, refer to another sheet
          dataValidation[castColumn.field] = {
            type: 'list',
            allowBlank: true,
            formulae: [address],
          };
        }

        const formattedValue = apiRef.current.getCellParams(id, castColumn.field).formattedValue;
        if (process.env.NODE_ENV !== 'production') {
          if (String(cellParams.formattedValue) === '[object Object]') {
            warnOnce([
              'MUI X: When the value of a field is an object or a `renderCell` is provided, the Excel export might not display the value correctly.',
              'You can provide a `valueFormatter` with a string representation to be used.',
            ]);
          }
        }
        if (isObject<{ label: any }>(formattedValue)) {
          row[castColumn.field] = formattedValue?.label;
        } else {
          row[castColumn.field] = formattedValue as any;
        }
        break;
      }
      case 'boolean':
      case 'number':
        cellValue = apiRef.current.getCellParams(id, column.field).value as any;
        break;
      case 'date':
      case 'dateTime': {
        // Excel does not do any timezone conversion, so we create a date using UTC instead of local timezone
        // Solution from: https://github.com/exceljs/exceljs/issues/486#issuecomment-432557582
        // About Date.UTC(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC#exemples
        const value = apiRef.current.getCellParams<any, Date>(id, column.field).value;
        // value may be `undefined` in auto-generated grouping rows
        if (!value) {
          break;
        }
        const utcDate = new Date(
          Date.UTC(
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
            value.getHours(),
            value.getMinutes(),
            value.getSeconds(),
          ),
        );
        row[column.field] = utcDate;
        break;
      }
      case 'actions':
        break;
      default:
        cellValue = apiRef.current.getCellParams(id, column.field).formattedValue as any;
        if (process.env.NODE_ENV !== 'production') {
          if (String(cellParams.formattedValue) === '[object Object]') {
            warnOnce([
              'MUI X: When the value of a field is an object or a `renderCell` is provided, the Excel export might not display the value correctly.',
              'You can provide a `valueFormatter` with a string representation to be used.',
            ]);
          }
        }
        break;
    }

    if (typeof cellValue === 'string' && options.escapeFormulas) {
      // See https://owasp.org/www-community/attacks/CSV_Injection
      if (['=', '+', '-', '@', '\t', '\r'].includes(cellValue[0])) {
        cellValue = `'${cellValue}`;
      }
    }

    if (typeof cellValue !== 'undefined') {
      row[column.field] = cellValue;
    }
  });

  return {
    row,
    dataValidation,
    outlineLevel,
    mergedCells,
  };
};

const defaultColumnsStyles = {
  [GRID_DATE_COL_DEF.type as string]: { numFmt: 'dd.mm.yyyy' },
  [GRID_DATETIME_COL_DEF.type as string]: { numFmt: 'dd.mm.yyyy hh:mm' },
};

export const serializeColumn = (column: GridColDef, columnsStyles: ColumnsStylesInterface) => {
  const { field, type } = column;

  return {
    key: field,
    headerText: column.headerName ?? column.field,
    // Excel width must stay between 0 and 255 (https://support.microsoft.com/en-us/office/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46)
    // From the example of column width behavior (https://docs.microsoft.com/en-US/office/troubleshoot/excel/determine-column-widths#example-of-column-width-behavior)
    // a value of 10 corresponds to 75px. This is an approximation, because column width depends on the font-size
    width: Math.min(255, column.width ? column.width / 7.5 : 8.43),
    style: { ...(type && defaultColumnsStyles?.[type]), ...columnsStyles?.[field] },
  };
};

export function serializeColumns(
  columns: GridStateColDef[],
  styles: ColumnsStylesInterface,
): SerializedColumns {
  return columns.map((column) => serializeColumn(column, styles));
}

export async function getDataForValueOptionsSheet(
  columns: GridStateColDef[],
  valueOptionsSheetName: string,
  api: GridPrivateApiPremium,
): Promise<ValueOptionsData> {
  const candidateColumns = columns.filter(
    (column) => isSingleSelectColDef(column) && Array.isArray(column.valueOptions),
  );

  // Creates a temp worksheet to obtain the column letters
  const excelJS = await getExcelJs();
  const workbook: Excel.Workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = candidateColumns.map((column) => ({ key: column.field }));

  return candidateColumns.reduce<Record<string, { values: (string | number)[]; address: string }>>(
    (acc, column) => {
      const singleSelectColumn = column as GridSingleSelectColDef;
      const formattedValueOptions = getFormattedValueOptions(
        singleSelectColumn,
        {},
        singleSelectColumn.valueOptions as Array<ValueOptions>,
        api,
      );
      const header = column.headerName ?? column.field;
      const values = [header, ...formattedValueOptions];

      const letter = worksheet.getColumn(column.field).letter;
      const address = `${valueOptionsSheetName}!$${letter}$2:$${letter}$${values.length}`;

      acc[column.field] = { values, address };

      return acc;
    },
    {},
  );
}
interface BuildExcelOptions
  extends Pick<GridExcelExportOptions, 'exceljsPreProcess' | 'exceljsPostProcess'>,
    Pick<
      Required<GridExcelExportOptions>,
      'valueOptionsSheetName' | 'includeHeaders' | 'includeColumnGroupsHeaders' | 'escapeFormulas'
    > {
  columns: GridStateColDef[];
  rowIds: GridRowId[];
  columnsStyles?: ColumnsStylesInterface;
}

export async function buildExcel(
  options: BuildExcelOptions,
  apiRef: RefObject<GridPrivateApiPremium>,
): Promise<Excel.Workbook> {
  const {
    columns,
    rowIds,
    includeHeaders,
    includeColumnGroupsHeaders,
    valueOptionsSheetName = 'Options',
    exceljsPreProcess,
    exceljsPostProcess,
    columnsStyles = {},
  } = options;

  const excelJS = await getExcelJs();
  const workbook: Excel.Workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const serializedColumns = serializeColumns(columns, columnsStyles);
  worksheet.columns = serializedColumns;

  if (exceljsPreProcess) {
    await exceljsPreProcess({
      workbook,
      worksheet,
    });
  }

  if (includeColumnGroupsHeaders) {
    const columnGroupPaths = columns.reduce<Record<string, string[]>>((acc, column) => {
      acc[column.field] = apiRef.current.getColumnGroupPath(column.field);
      return acc;
    }, {});

    addColumnGroupingHeaders(
      worksheet,
      serializedColumns,
      columnGroupPaths,
      apiRef.current.getAllGroupDetails(),
    );
  }

  if (includeHeaders) {
    worksheet.addRow(columns.map((column) => column.headerName ?? column.field));
  }

  const valueOptionsData = await getDataForValueOptionsSheet(
    columns,
    valueOptionsSheetName,
    apiRef.current,
  );
  createValueOptionsSheetIfNeeded(valueOptionsData, valueOptionsSheetName, workbook);

  apiRef.current.resetColSpan();
  rowIds.forEach((id) => {
    const serializedRow = serializeRowUnsafe(id, columns, apiRef, valueOptionsData, options);
    addSerializedRowToWorksheet(serializedRow, worksheet);
  });
  apiRef.current.resetColSpan();

  if (exceljsPostProcess) {
    await exceljsPostProcess({
      workbook,
      worksheet,
    });
  }

  return workbook;
}
