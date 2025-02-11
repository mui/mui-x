import type * as Excel from 'exceljs';
import type { GridColumnGroupLookup } from '@mui/x-data-grid/internals';
import type { GridExcelExportOptions } from '../gridExcelExportInterface';

export const getExcelJs = async () => {
  const excelJsModule = await import('exceljs');
  return excelJsModule.default ?? excelJsModule;
};

export interface SerializedRow {
  row: Record<string, undefined | number | boolean | string | Date>;
  dataValidation: Record<string, Excel.DataValidation>;
  outlineLevel: number;
  mergedCells: { leftIndex: number; rightIndex: number }[];
}

export const addColumnGroupingHeaders = (
  worksheet: Excel.Worksheet,
  columns: SerializedColumns,
  columnGroupPaths: Record<string, string[]>,
  columnGroupDetails: GridColumnGroupLookup,
) => {
  const maxDepth = Math.max(...columns.map(({ key }) => columnGroupPaths[key]?.length ?? 0));
  if (maxDepth === 0) {
    return;
  }

  for (let rowIndex = 0; rowIndex < maxDepth; rowIndex += 1) {
    const row = columns.map(({ key }) => {
      const groupingPath = columnGroupPaths[key];
      if (groupingPath.length <= rowIndex) {
        return { groupId: null, parents: groupingPath };
      }
      return {
        ...columnGroupDetails[groupingPath[rowIndex]],
        parents: groupingPath.slice(0, rowIndex),
      };
    });

    const newRow = worksheet.addRow(
      row.map((group) => (group.groupId === null ? null : (group?.headerName ?? group.groupId))),
    );

    // use `rowCount`, since worksheet can have additional rows added in `exceljsPreProcess`
    const lastRowIndex = newRow.worksheet.rowCount;
    let leftIndex = 0;
    let rightIndex = 1;
    while (rightIndex < columns.length) {
      const { groupId: leftGroupId, parents: leftParents } = row[leftIndex];
      const { groupId: rightGroupId, parents: rightParents } = row[rightIndex];

      const areInSameGroup =
        leftGroupId === rightGroupId &&
        leftParents.length === rightParents.length &&
        leftParents.every((leftParent, index) => rightParents[index] === leftParent);
      if (areInSameGroup) {
        rightIndex += 1;
      } else {
        if (rightIndex - leftIndex > 1) {
          worksheet.mergeCells(lastRowIndex, leftIndex + 1, lastRowIndex, rightIndex);
        }
        leftIndex = rightIndex;
        rightIndex += 1;
      }
    }
    if (rightIndex - leftIndex > 1) {
      worksheet.mergeCells(lastRowIndex, leftIndex + 1, lastRowIndex, rightIndex);
    }
  }
};

export type SerializedColumns = Array<{
  key: string;
  width: number;
  style: Partial<Excel.Style>;
  headerText: string;
}>;

export type ValueOptionsData = Record<string, { values: (string | number)[]; address: string }>;

export function addSerializedRowToWorksheet(
  serializedRow: SerializedRow,
  worksheet: Excel.Worksheet,
) {
  const { row, dataValidation, outlineLevel, mergedCells } = serializedRow;

  const newRow = worksheet.addRow(row);

  Object.keys(dataValidation).forEach((field) => {
    newRow.getCell(field).dataValidation = {
      ...dataValidation[field],
    };
  });

  if (outlineLevel) {
    newRow.outlineLevel = outlineLevel;
  }

  // use `rowCount`, since worksheet can have additional rows added in `exceljsPreProcess`
  const lastRowIndex = newRow.worksheet.rowCount;
  mergedCells.forEach((mergedCell) => {
    worksheet.mergeCells(lastRowIndex, mergedCell.leftIndex, lastRowIndex, mergedCell.rightIndex);
  });
}

export async function createValueOptionsSheetIfNeeded(
  valueOptionsData: ValueOptionsData,
  sheetName: string,
  workbook: Excel.Workbook,
) {
  if (Object.keys(valueOptionsData).length === 0) {
    return;
  }

  const valueOptionsWorksheet = workbook.addWorksheet(sheetName);

  valueOptionsWorksheet.columns = Object.keys(valueOptionsData).map((key) => ({ key }));

  Object.entries(valueOptionsData).forEach(([field, { values }]) => {
    valueOptionsWorksheet.getColumn(field).values = values;
  });
}

export interface ExcelExportInitEvent {
  namespace?: string;
  serializedColumns: SerializedColumns;
  serializedRows: SerializedRow[];
  valueOptionsSheetName: string;
  columnGroupPaths: Record<string, string[]>;
  columnGroupDetails: GridColumnGroupLookup;
  valueOptionsData: ValueOptionsData;
  options: Omit<
    GridExcelExportOptions,
    'exceljsPreProcess' | 'exceljsPostProcess' | 'columnsStyles' | 'valueOptionsSheetName'
  >;
}
