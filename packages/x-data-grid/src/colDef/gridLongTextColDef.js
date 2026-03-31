import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { renderLongTextCell } from '../components/cell/GridLongTextCell';
import { renderEditLongTextCell } from '../components/cell/GridEditLongTextCell';
export const GRID_LONG_TEXT_COL_DEF = {
    ...GRID_STRING_COL_DEF,
    type: 'longText',
    display: 'flex',
    renderCell: renderLongTextCell,
    renderEditCell: renderEditLongTextCell,
};
