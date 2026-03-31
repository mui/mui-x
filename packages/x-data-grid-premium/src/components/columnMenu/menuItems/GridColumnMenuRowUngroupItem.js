import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { gridColumnLookupSelector, useGridSelector, } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
export function GridColumnMenuRowUngroupItem(props) {
    const { colDef, onClick } = props;
    const apiRef = useGridApiContext();
    const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
    const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const rootProps = useGridRootProps();
    if (!colDef.groupable) {
        return null;
    }
    const ungroupColumn = (event) => {
        apiRef.current.removeRowGroupingCriteria(colDef.field);
        onClick(event);
    };
    const groupColumn = (event) => {
        apiRef.current.addRowGroupingCriteria(colDef.field);
        onClick(event);
    };
    const name = columnsLookup[colDef.field].headerName ?? colDef.field;
    if (rowGroupingModel.includes(colDef.field)) {
        return (_jsx(rootProps.slots.baseMenuItem, { onClick: ungroupColumn, iconStart: _jsx(rootProps.slots.columnMenuUngroupIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('unGroupColumn')(name) }));
    }
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: groupColumn, iconStart: _jsx(rootProps.slots.columnMenuGroupIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('groupColumn')(name) }));
}
