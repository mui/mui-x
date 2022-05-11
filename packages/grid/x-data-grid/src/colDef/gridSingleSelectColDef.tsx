import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from '../models/colDef/gridColDef';
import { renderEditSingleSelectCell } from '../components/cell/GridEditSingleSelectCell';
import {
  getGridSingleSelectOperators,
  getGridSingleSelectQuickFilterFn,
} from './gridSingleSelectOperators';

export const GRID_SINGLE_SELECT_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'singleSelect',
  renderEditCell: renderEditSingleSelectCell,
  filterOperators: getGridSingleSelectOperators(),
  getApplyQuickFilterFn: getGridSingleSelectQuickFilterFn,
};
