import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { gridPivotPanelOpenSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridSidebarValue } from '../../../hooks/features/sidebar';
export function GridColumnMenuPivotItem(props) {
    const { onClick } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const isPivotPanelOpen = useGridSelector(apiRef, gridPivotPanelOpenSelector);
    const openPivotSettings = (event) => {
        onClick(event);
        apiRef.current.showSidebar(GridSidebarValue.Pivot);
    };
    if (rootProps.disablePivoting) {
        return null;
    }
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: openPivotSettings, iconStart: _jsx(rootProps.slots.pivotIcon, { fontSize: "small" }), disabled: isPivotPanelOpen, children: apiRef.current.getLocaleText('columnMenuManagePivot') }));
}
