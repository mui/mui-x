import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridParamsApi } from '../../../models/api/gridParamsApi';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams, GridValueGetterParams } from '../../../models/params/gridCellParams';
import { GridColParams } from '../../../models/params/gridColParams';
import { GridRowParams } from '../../../models/params/gridRowParams';
import {
  getGridCellElement,
  getGridColumnHeaderElement,
  getGridRowElement,
} from '../../../utils/domUtils';
import { useGridApiMethod } from '../../root/useGridApiMethod';

let warnedOnce = false;
function warnMissingColumn(field) {
  if (!warnedOnce && process.env.NODE_ENV !== 'production') {
    console.warn(
      [
        `Material-UI: You are calling getValue('${field}') but the column \`${field}\` is not defined.`,
        `Instead, you can access the data from \`params.row.${field}\`.`,
      ].join('\n'),
    );
    warnedOnce = true;
  }
}
export function useGridParamsApi(apiRef: GridApiRef) {
  const getColumnHeaderParams = React.useCallback(
    (field: string): GridColParams => ({
      field,
      element: apiRef.current.getColumnHeaderElement(field),
      colDef: apiRef.current.getColumnFromField(field),
      colIndex: apiRef.current.getColumnIndex(field, true),
      api: apiRef!.current,
    }),
    [apiRef],
  );

  const getRowParams = React.useCallback(
    (id: GridRowId) => {
      const params: GridRowParams = {
        id,
        element: apiRef.current.getRowElement(id),
        columns: apiRef.current.getAllColumns(),
        getValue: (columnField: string) => apiRef.current.getCellValue(id, columnField),
        row: apiRef.current.getRowFromId(id),
        rowIndex: apiRef.current.getRowIndexFromId(id),
        api: apiRef.current,
      };
      return params;
    },
    [apiRef],
  );

  const getBaseCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const element = apiRef.current.getCellElement(id, field);
      const row = apiRef.current.getRowFromId(id);

      const params: GridValueGetterParams = {
        element,
        id,
        field,
        row,
        value: row[field],
        getValue: (columnField: string) => apiRef.current.getCellValue(id, columnField),
        colDef: apiRef.current.getColumnFromField(field),
        cellMode: apiRef.current.getCellMode(id, field),
        rowIndex: apiRef.current.getRowIndexFromId(id),
        colIndex: apiRef.current.getColumnIndex(field, true),
        api: apiRef.current,
      };

      return params;
    },
    [apiRef],
  );

  const getCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumnFromField(field);
      const element = apiRef.current.getCellElement(id, field);
      const value = apiRef.current.getCellValue(id, field);
      const baseParams = getBaseCellParams(id, field);
      const params: GridCellParams = {
        ...baseParams,
        value,
        getValue: (columnField: string) => apiRef.current.getCellValue(id, columnField),
        formattedValue: value,
      };
      if (colDef.valueFormatter) {
        params.formattedValue = colDef.valueFormatter(params);
      }
      const isEditableAttr = element && element.getAttribute('data-editable');
      params.isEditable =
        isEditableAttr != null
          ? isEditableAttr === 'true'
          : colDef && apiRef.current.isCellEditable(params);

      return params;
    },
    [apiRef, getBaseCellParams],
  );

  const getCellValue = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumnFromField(field);
      const rowModel = apiRef.current.getRowFromId(id);

      if (!colDef) {
        warnMissingColumn(field);
      }
      if (!colDef || !colDef.valueGetter) {
        return rowModel[field];
      }

      return colDef.valueGetter(getBaseCellParams(id, field));
    },
    [apiRef, getBaseCellParams],
  );

  const getColumnHeaderElement = React.useCallback(
    (field: string): HTMLDivElement | null => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridColumnHeaderElement(apiRef.current.rootElementRef!.current!, field);
    },
    [apiRef],
  );
  const getRowElement = React.useCallback(
    (id: GridRowId): HTMLDivElement | null => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridRowElement(apiRef.current.rootElementRef!.current!, id);
    },
    [apiRef],
  );

  const getCellElement = React.useCallback(
    (id: GridRowId, field: string): HTMLDivElement | null => {
      if (!apiRef.current.rootElementRef!.current) {
        return null;
      }
      return getGridCellElement(apiRef.current.rootElementRef!.current!, { id, field });
    },
    [apiRef],
  );

  useGridApiMethod<GridParamsApi>(
    apiRef,
    {
      getCellValue,
      getCellParams,
      getCellElement,
      getRowParams,
      getRowElement,
      getColumnHeaderParams,
      getColumnHeaderElement,
    },
    'CellApi',
  );
}
