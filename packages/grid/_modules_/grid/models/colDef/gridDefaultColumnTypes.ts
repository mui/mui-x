import { GridColumnTypesRecord } from './gridColumnTypesRecord';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GRID_NUMERIC_COL_DEF } from './gridNumericColDef';
import { GRID_DATE_COL_DEF, GRID_DATETIME_COL_DEF } from './gridDateColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';
import { GRID_SINGLE_SELECT_COL_DEF } from './gridSingleSelectColDef';
import { GRID_ACTIONS_COL_DEF } from './gridActionsColDef';

export const DEFAULT_GRID_COL_TYPE_KEY = '__default__';
export const getGridDefaultColumnTypes: () => GridColumnTypesRecord = () => {
  const nativeColumnTypes = {
    string: GRID_STRING_COL_DEF,
    number: GRID_NUMERIC_COL_DEF,
    date: GRID_DATE_COL_DEF,
    dateTime: GRID_DATETIME_COL_DEF,
    boolean: GRID_BOOLEAN_COL_DEF,
    singleSelect: GRID_SINGLE_SELECT_COL_DEF,
    actions: GRID_ACTIONS_COL_DEF,
  };
  nativeColumnTypes[DEFAULT_GRID_COL_TYPE_KEY] = GRID_STRING_COL_DEF;

  return nativeColumnTypes;
};
