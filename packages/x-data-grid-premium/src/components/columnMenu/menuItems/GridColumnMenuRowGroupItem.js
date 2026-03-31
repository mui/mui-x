import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useGridSelector, gridColumnLookupSelector, } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { gridRowGroupingSanitizedModelSelector } from '../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { getRowGroupingCriteriaFromGroupingField, GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, isGroupingColumn, } from '../../../hooks/features/rowGrouping/gridRowGroupingUtils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
export function GridColumnMenuRowGroupItem(props) {
    const { colDef, onClick } = props;
    const apiRef = useGridApiContext();
    const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
    const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const rootProps = useGridRootProps();
    const renderUnGroupingMenuItem = (field) => {
        const ungroupColumn = (event) => {
            apiRef.current.removeRowGroupingCriteria(field);
            onClick(event);
        };
        const groupedColumn = columnsLookup[field];
        const name = groupedColumn.headerName ?? field;
        return (_jsx(rootProps.slots.baseMenuItem, { onClick: ungroupColumn, disabled: !groupedColumn.groupable, iconStart: _jsx(rootProps.slots.columnMenuUngroupIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('unGroupColumn')(name) }, field));
    };
    if (!colDef || !isGroupingColumn(colDef.field)) {
        return null;
    }
    if (colDef.field === GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
        return _jsx(React.Fragment, { children: rowGroupingModel.map(renderUnGroupingMenuItem) });
    }
    return renderUnGroupingMenuItem(getRowGroupingCriteriaFromGroupingField(colDef.field));
}
