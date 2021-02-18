import { GridCellValue } from '../models/gridCell';
import { GridRowModel } from '../models/gridRows';
import { GridColDef } from '../models/colDef/gridColDef';
import { GridApi } from '../models/api/gridApi';
import { GridCellParams } from '../models/params/gridCellParams';
import { GridRowParams } from '../models/params/gridRowParams';

let warnedOnce = false;

export function buildGridCellParams({
  element,
  value,
  rowIndex,
  rowModel,
  colDef,
  api,
}: {
  rowModel: GridRowModel;
  colDef: GridColDef;
  rowIndex?: number;
  value: GridCellValue;
  api: GridApi;
  element?: HTMLElement;
}): GridCellParams {
  return {
    element,
    value,
    field: colDef?.field,
    getValue: (field: string) => {
      // We are getting the value of another column here, field
      const col = api.getColumnFromField(field);

      if (process.env.NODE_ENV !== 'production') {
        if (!col && !warnedOnce) {
          console.warn(
            [
              `Material-UI: You are calling getValue('${field}') but the column \`${field}\` is not defined.`,
              `Instead, you can access the data from \`params.row.${field}\`.`,
            ].join('\n'),
          );
          warnedOnce = true;
        }
      }

      if (!col || !col.valueGetter) {
        return rowModel[field];
      }

      return col.valueGetter(
        buildGridCellParams({
          value: rowModel[field],
          colDef: col,
          rowIndex,
          element,
          rowModel,
          api,
        }),
      );
    },
    row: rowModel,
    colDef,
    rowIndex,
    api,
  };
}

export function buildGridRowParams({
  element,
  rowIndex,
  rowModel,
  api,
}: {
  rowModel: GridRowModel;
  colDef: GridColDef;
  rowIndex: number;
  api: GridApi;
  element?: HTMLElement;
}): GridRowParams {
  return {
    element,
    columns: api.getAllColumns(),
    getValue: (field: string) => rowModel[field],
    row: rowModel,
    rowIndex,
    api,
  };
}
