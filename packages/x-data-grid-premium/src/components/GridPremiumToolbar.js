import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { GridToolbar, GridToolbarDivider, useGridSelector, } from '@mui/x-data-grid-pro/internals';
import { ColumnsPanelTrigger, FilterPanelTrigger, ToolbarButton } from '@mui/x-data-grid-pro';
import { ExportExcel } from './export';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { PivotPanelTrigger } from './pivotPanel/PivotPanelTrigger';
import { AiAssistantPanelTrigger } from './aiAssistantPanel';
import { ChartsPanelTrigger } from './chartsPanel/ChartsPanelTrigger';
import { gridHistoryCanRedoSelector, gridHistoryCanUndoSelector, gridHistoryEnabledSelector, } from '../hooks/features/history';
export function GridPremiumToolbar(props) {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const { excelOptions, ...other } = props;
    const historyEnabled = useGridSelector(apiRef, gridHistoryEnabledSelector);
    const showHistoryControls = rootProps.slotProps?.toolbar?.showHistoryControls !== false && historyEnabled;
    const canUndo = useGridSelector(apiRef, gridHistoryCanUndoSelector);
    const canRedo = useGridSelector(apiRef, gridHistoryCanRedoSelector);
    const mainControls = (_jsxs(React.Fragment, { children: [showHistoryControls && (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarUndo'), children: _jsx("div", { children: _jsx(ToolbarButton, { disabled: !canUndo, onClick: () => apiRef.current.history.undo(), children: _jsx(rootProps.slots.undoIcon, { fontSize: "small" }) }) }) }), _jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarRedo'), children: _jsx("div", { children: _jsx(ToolbarButton, { disabled: !canRedo, onClick: () => apiRef.current.history.redo(), children: _jsx(rootProps.slots.redoIcon, { fontSize: "small" }) }) }) })] })), showHistoryControls && _jsx(GridToolbarDivider, {}), !rootProps.disableColumnSelector && (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarColumns'), children: _jsx(ColumnsPanelTrigger, { render: _jsx(ToolbarButton, {}), children: _jsx(rootProps.slots.columnSelectorIcon, { fontSize: "small" }) }) })), !rootProps.disableColumnFilter && (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarFilters'), children: _jsx(FilterPanelTrigger, { render: (triggerProps, state) => (_jsx(ToolbarButton, { ...triggerProps, color: state.filterCount > 0 ? 'primary' : 'default', children: _jsx(rootProps.slots.baseBadge, { badgeContent: state.filterCount, color: "primary", variant: "dot", children: _jsx(rootProps.slots.openFilterButtonIcon, { fontSize: "small" }) }) })) }) })), !rootProps.disablePivoting && (_jsx(PivotPanelTrigger, { render: (triggerProps, state) => (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarPivot'), children: _jsx(ToolbarButton, { ...triggerProps, color: state.active ? 'primary' : 'default', children: _jsx(rootProps.slots.pivotIcon, { fontSize: "small" }) }) })) })), rootProps.chartsIntegration && (_jsx(ChartsPanelTrigger, { render: (triggerProps) => (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarCharts'), children: _jsx(ToolbarButton, { ...triggerProps, color: "default", children: _jsx(rootProps.slots.chartsIcon, { fontSize: "small" }) }) })) })), rootProps.aiAssistant && (_jsx(AiAssistantPanelTrigger, { render: (triggerProps) => (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarAssistant'), children: _jsx(ToolbarButton, { ...triggerProps, color: "default", children: _jsx(rootProps.slots.aiAssistantIcon, { fontSize: "small" }) }) })) }))] }));
    const additionalExportMenuItems = !props.excelOptions?.disableToolbarButton
        ? (onMenuItemClick) => (_jsx(ExportExcel, { render: _jsx(rootProps.slots.baseMenuItem, { ...rootProps.slotProps?.baseMenuItem }), options: props.excelOptions, onClick: onMenuItemClick, children: apiRef.current.getLocaleText('toolbarExportExcel') }))
        : undefined;
    return (_jsx(GridToolbar, { ...other, mainControls: mainControls, additionalExportMenuItems: additionalExportMenuItems }));
}
