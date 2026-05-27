import type { GridColType } from '../models/colDef/gridColType';
import type { GridColTypeDef } from '../models/colDef/gridColDef';
import type { GridColumnTypesRecord } from '../models/colDef/gridColumnTypesRecord';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GRID_NUMERIC_COL_DEF } from './gridNumericColDef';
import { GRID_DATE_COL_DEF, GRID_DATETIME_COL_DEF } from './gridDateColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';
import { GRID_SINGLE_SELECT_COL_DEF } from './gridSingleSelectColDef';
import { GRID_ACTIONS_COL_DEF, GRID_ACTIONS_COLUMN_TYPE } from './gridActionsColDef';
import { GRID_LONG_TEXT_COL_DEF } from './gridLongTextColDef';

export const DEFAULT_GRID_COL_TYPE_KEY = 'string';

// Mutable registry seeded with the community column types. Pro/Premium packages append
// their own types at module load via `registerGridColumnTypes`, so a community-only bundle
// never references them at runtime.
const columnTypesRegistry: Record<string, GridColTypeDef> = {
  string: GRID_STRING_COL_DEF,
  number: GRID_NUMERIC_COL_DEF,
  date: GRID_DATE_COL_DEF,
  dateTime: GRID_DATETIME_COL_DEF,
  boolean: GRID_BOOLEAN_COL_DEF,
  singleSelect: GRID_SINGLE_SELECT_COL_DEF,
  [GRID_ACTIONS_COLUMN_TYPE]: GRID_ACTIONS_COL_DEF,
  custom: GRID_STRING_COL_DEF,
  longText: GRID_LONG_TEXT_COL_DEF,
};

export const registerGridColumnTypes = (columnTypes: Partial<GridColumnTypesRecord>) => {
  Object.assign(columnTypesRegistry, columnTypes);
};

export const getGridColumnTypesRegistry = () => columnTypesRegistry;

export const getRegisteredColumnTypeDef = (type: GridColType | undefined): GridColTypeDef =>
  (type ? columnTypesRegistry[type] : undefined) ?? columnTypesRegistry[DEFAULT_GRID_COL_TYPE_KEY];
