import { jsx as _jsx } from "react/jsx-runtime";
import { GridCellCheckboxRenderer } from '../components/columnSelection/GridCellCheckboxRenderer';
import { GridHeaderCheckbox } from '../components/columnSelection/GridHeaderCheckbox';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';
import { gridRowIdSelector } from '../hooks/core/gridPropsSelectors';
export const GRID_CHECKBOX_SELECTION_FIELD = '__check__';
export const GRID_CHECKBOX_SELECTION_COL_DEF = {
    ...GRID_BOOLEAN_COL_DEF,
    type: 'custom',
    field: GRID_CHECKBOX_SELECTION_FIELD,
    width: 50,
    resizable: false,
    sortable: false,
    filterable: false,
    // @ts-ignore
    aggregable: false,
    chartable: false,
    disableColumnMenu: true,
    disableReorder: true,
    disableExport: true,
    getApplyQuickFilterFn: () => null,
    display: 'flex',
    valueGetter: (value, row, column, apiRef) => {
        const rowId = gridRowIdSelector(apiRef, row);
        return apiRef.current.isRowSelected(rowId);
    },
    rowSpanValueGetter: (_, row, column, apiRef) => gridRowIdSelector(apiRef, row),
    renderHeader: (params) => _jsx(GridHeaderCheckbox, { ...params }),
    renderCell: (params) => _jsx(GridCellCheckboxRenderer, { ...params }),
};
