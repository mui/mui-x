import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { gridChartsPanelOpenSelector } from '../../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
export function GridColumnMenuChartsItem(props) {
    const { onClick } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const isChartsPanelOpen = useGridSelector(apiRef, gridChartsPanelOpenSelector);
    const openChartsSettings = (event) => {
        onClick(event);
        apiRef.current.setChartsPanelOpen(true);
    };
    if (!rootProps.chartsIntegration) {
        return null;
    }
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: openChartsSettings, iconStart: _jsx(rootProps.slots.chartsIcon, { fontSize: "small" }), disabled: isChartsPanelOpen, children: apiRef.current.getLocaleText('columnMenuManageCharts') }));
}
