import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridParamsApi } from '../../../models/api/gridParamsApi';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams, GridValueGetterParams } from '../../../models/params/gridCellParams';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import { GridRowParams } from '../../../models/params/gridRowParams';
import {
  getGridCellElement,
  getGridColumnHeaderElement,
  getGridRowElement,
} from '../../../utils/domUtils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';

let warnedOnce = false;
function warnMissingColumn(field) {
  console.warn(
    [
      `MUI: You are calling getValue('${field}') but the column \`${field}\` is not defined.`,
      `Instead, you can access the data from \`params.row.${field}\`.`,
    ].join('\n'),
  );
  warnedOnce = true;
}

/**
 * @requires useGridColumns (method)
 * @requires useGridRows (method)
 * @requires useGridFocus (state)
 * @requires useGridEditRows (method)
 * TODO: Impossible priority - useGridEditRows also needs to be after useGridParamsApi
 * TODO: Impossible priority - useGridFocus also needs to be after useGridParamsApi
 */
export function useGridParamsApi(apiRef: GridApiRef) {
  const getColumnHeaderParams = React.useCallback(
    (field: string): GridColumnHeaderParams => ({
      field,
      colDef: apiRef.current.getColumn(field),
    }),
    [apiRef],
  );

  const getRowParams = React.useCallback(
    (id: GridRowId) => {
      const row = apiRef.current.getRow(id);

      if (!row) {
        throw new Error(`No row with id #${id} found`);
      }

      const params: GridRowParams = {
        id,
        columns: apiRef.current.getAllColumns(),
        row,
        getValue: apiRef.current.getCellValue,
      };
      return params;
    },
    [apiRef],
  );

  const getBaseCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const row = apiRef.current.getRow(id);

      if (!row) {
        throw new Error(`No row with id #${id} found`);
      }

      const cellFocus = gridFocusCellSelector(apiRef.current.state);
      const cellTabIndex = gridTabIndexCellSelector(apiRef.current.state);

      const params: GridValueGetterParams = {
        id,
        field,
        row,
        value: row[field],
        colDef: apiRef.current.getColumn(field),
        cellMode: apiRef.current.getCellMode(id, field),
        getValue: apiRef.current.getCellValue,
        api: apiRef.current,
        hasFocus: cellFocus !== null && cellFocus.field === field && cellFocus.id === id,
        tabIndex: cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === id ? 0 : -1,
      };

      return params;
    },
    [apiRef],
  );

  const getCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumn(field);
      const value = apiRef.current.getCellValue(id, field);
      const row = apiRef.current.getRow(id);

      if (!row) {
        throw new Error(`No row with id #${id} found`);
      }

      const cellFocus = gridFocusCellSelector(apiRef.current.state);
      const cellTabIndex = gridTabIndexCellSelector(apiRef.current.state);

      const params: GridCellParams = {
        id,
        field,
        row,
        colDef,
        cellMode: apiRef.current.getCellMode(id, field),
        getValue: apiRef.current.getCellValue,
        hasFocus: cellFocus !== null && cellFocus.field === field && cellFocus.id === id,
        tabIndex: cellTabIndex && cellTabIndex.field === field && cellTabIndex.id === id ? 0 : -1,
        value,
        formattedValue: value,
      };
      if (colDef.valueFormatter) {
        params.formattedValue = colDef.valueFormatter({
          id,
          field: params.field,
          value: params.value,
          api: apiRef.current,
        });
      }
      params.isEditable = colDef && apiRef.current.isCellEditable(params);

      return params;
    },
    [apiRef],
  );

  const getCellValue = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumn(field);

      if (process.env.NODE_ENV !== 'production') {
        if (!colDef && !warnedOnce) {
          warnMissingColumn(field);
        }
      }

      if (!colDef || !colDef.valueGetter) {
        const rowModel = apiRef.current.getRow(id);

        if (!rowModel) {
          throw new Error(`No row with id #${id} found`);
        }

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
    'GridParamsApi',
  );
}
