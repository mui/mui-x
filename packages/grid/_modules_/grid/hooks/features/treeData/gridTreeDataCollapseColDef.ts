import {GRID_BOOLEAN_COL_DEF} from "../../../models/colDef/gridBooleanColDef";
import {GridColDef} from "../../../models/colDef/gridColDef";

export const GridTreeDataCollapseColDef: GridColDef = {
    ...GRID_BOOLEAN_COL_DEF,
    field: '__check__',
    width: 50,
    resizable: false,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    disableReorder: true,
    valueGetter: () => true,
    renderHeader: () => 'Header',
    renderCell: () => 'Content',
}