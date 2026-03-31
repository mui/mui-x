import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useGridSelector, getDataGridUtilityClass, gridRowCountSelector, } from '@mui/x-data-grid-pro';
import { vars, NotRendered } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { SidebarHeader } from '../sidebar';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridPivotActiveSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { GridPivotPanelSearch } from './GridPivotPanelSearch';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['pivotPanelHeader'],
        switch: ['pivotPanelSwitch'],
        label: ['pivotPanelSwitchLabel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPivotPanelHeaderRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelHeader',
})({
    display: 'flex',
    alignItems: 'center',
    gap: vars.spacing(1),
    padding: vars.spacing(0, 0.75, 0, 1),
    boxSizing: 'border-box',
    height: 52,
});
const GridPivotPanelSwitch = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSwitch',
})({
    marginRight: 'auto',
});
const GridPivotPanelSwitchLabel = styled('span', {
    name: 'MuiDataGrid',
    slot: 'PivotPanelSwitchLabel',
})({
    font: vars.typography.font.large,
    fontWeight: vars.typography.fontWeight.medium,
});
function GridPivotPanelHeader(props) {
    const { searchValue, onSearchValueChange } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const classes = useUtilityClasses(rootProps);
    const rows = useGridSelector(apiRef, gridRowCountSelector);
    const isEmptyPivot = pivotActive && rows === 0;
    return (_jsxs(SidebarHeader, { children: [_jsxs(GridPivotPanelHeaderRoot, { ownerState: rootProps, className: classes.root, children: [_jsx(GridPivotPanelSwitch, { as: rootProps.slots.baseSwitch, ownerState: rootProps, className: classes.switch, checked: pivotActive, onChange: (event) => apiRef.current.setPivotActive(event.target.checked), size: "small", label: _jsx(GridPivotPanelSwitchLabel, { ownerState: rootProps, className: classes.label, children: apiRef.current.getLocaleText('pivotToggleLabel') }), ...rootProps.slotProps?.baseSwitch }), _jsx(rootProps.slots.baseIconButton, { onClick: () => {
                            apiRef.current.hideSidebar();
                            if (isEmptyPivot) {
                                apiRef.current.setPivotActive(false);
                            }
                        }, "aria-label": apiRef.current.getLocaleText('pivotCloseButton'), ...rootProps.slotProps?.baseIconButton, children: _jsx(rootProps.slots.sidebarCloseIcon, { fontSize: "small" }) })] }), _jsx(GridPivotPanelSearch, { value: searchValue, onClear: () => onSearchValueChange(''), onChange: (event) => onSearchValueChange(event.target.value) })] }));
}
export { GridPivotPanelHeader };
