import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from './gridColDef';
import { renderEditSelectCell } from '../../components/cell/GridEditSelectCell';
import { getGridSelectOperators } from './gridSelectOperators';

export const GRID_SELECT_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'select',
  renderEditCell: renderEditSelectCell,
  filterOperators: getGridSelectOperators(),
};
