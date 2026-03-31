'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { GridMenu } from '../menu/GridMenu';
import { Toolbar } from './Toolbar';
import { ToolbarButton } from './ToolbarButton';
import { FilterPanelTrigger } from '../filterPanel';
import { ColumnsPanelTrigger } from '../columnsPanel';
import { ExportCsv, ExportPrint } from '../export';
import { GridToolbarQuickFilter } from '../toolbar/GridToolbarQuickFilter';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { NotRendered } from '../../utils/assert';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        divider: ['toolbarDivider'],
        label: ['toolbarLabel'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const Divider = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ToolbarDivider',
})({
    height: '50%',
    margin: vars.spacing(0, 0.5),
});
const Label = styled('span', {
    name: 'MuiDataGrid',
    slot: 'ToolbarLabel',
})({
    flex: 1,
    font: vars.typography.font.large,
    fontWeight: vars.typography.fontWeight.medium,
    margin: vars.spacing(0, 0.5),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
});
function GridToolbarDivider(props) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(Divider, { as: rootProps.slots.baseDivider, orientation: "vertical", className: classes.divider, ...other }));
}
GridToolbarDivider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: PropTypes.string,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};
function GridToolbarLabel(props) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return _jsx(Label, { className: classes.label, ...other });
}
function GridToolbar(props) {
    const { showQuickFilter = true, quickFilterProps, csvOptions, printOptions, mainControls, additionalExportMenuItems, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
    const exportMenuTriggerRef = React.useRef(null);
    const exportMenuId = useId();
    const exportMenuTriggerId = useId();
    const showExportMenu = !csvOptions?.disableToolbarButton ||
        !printOptions?.disableToolbarButton ||
        additionalExportMenuItems;
    const closeExportMenu = () => setExportMenuOpen(false);
    return (_jsxs(Toolbar, { ...other, children: [rootProps.label && _jsx(GridToolbarLabel, { children: rootProps.label }), mainControls || (_jsxs(React.Fragment, { children: [!rootProps.disableColumnSelector && (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarColumns'), children: _jsx(ColumnsPanelTrigger, { render: _jsx(ToolbarButton, {}), children: _jsx(rootProps.slots.columnSelectorIcon, { fontSize: "small" }) }) })), !rootProps.disableColumnFilter && (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarFilters'), children: _jsx(FilterPanelTrigger, { render: (triggerProps, state) => (_jsx(ToolbarButton, { ...triggerProps, color: state.filterCount > 0 ? 'primary' : 'default', children: _jsx(rootProps.slots.baseBadge, { badgeContent: state.filterCount, color: "primary", variant: "dot", children: _jsx(rootProps.slots.openFilterButtonIcon, { fontSize: "small" }) }) })) }) }))] })), showExportMenu && (!rootProps.disableColumnFilter || !rootProps.disableColumnSelector) && (_jsx(GridToolbarDivider, {})), showExportMenu && (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarExport'), disableInteractive: exportMenuOpen, children: _jsx(ToolbarButton, { ref: exportMenuTriggerRef, id: exportMenuTriggerId, "aria-controls": exportMenuId, "aria-haspopup": "true", "aria-expanded": exportMenuOpen ? 'true' : undefined, onClick: () => setExportMenuOpen(!exportMenuOpen), children: _jsx(rootProps.slots.exportIcon, { fontSize: "small" }) }) }), _jsx(GridMenu, { target: exportMenuTriggerRef.current, open: exportMenuOpen, onClose: closeExportMenu, position: "bottom-end", children: _jsxs(rootProps.slots.baseMenuList, { id: exportMenuId, "aria-labelledby": exportMenuTriggerId, autoFocusItem: true, ...rootProps.slotProps?.baseMenuList, children: [!printOptions?.disableToolbarButton && (_jsx(ExportPrint, { render: _jsx(rootProps.slots.baseMenuItem, { ...rootProps.slotProps?.baseMenuItem }), options: printOptions, onClick: closeExportMenu, children: apiRef.current.getLocaleText('toolbarExportPrint') })), !csvOptions?.disableToolbarButton && (_jsx(ExportCsv, { render: _jsx(rootProps.slots.baseMenuItem, { ...rootProps.slotProps?.baseMenuItem }), options: csvOptions, onClick: closeExportMenu, children: apiRef.current.getLocaleText('toolbarExportCSV') })), additionalExportMenuItems?.(closeExportMenu)] }) })] })), showQuickFilter && (_jsxs(React.Fragment, { children: [_jsx(GridToolbarDivider, {}), _jsx(GridToolbarQuickFilter, { ...quickFilterProps })] }))] }));
}
GridToolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    additionalExportMenuItems: PropTypes.func,
    additionalItems: PropTypes.node,
    csvOptions: PropTypes.object,
    printOptions: PropTypes.object,
    /**
     * Props passed to the quick filter component.
     */
    quickFilterProps: PropTypes.shape({
        className: PropTypes.string,
        debounceMs: PropTypes.number,
        quickFilterFormatter: PropTypes.func,
        quickFilterParser: PropTypes.func,
        slotProps: PropTypes.object,
    }),
    /**
     * Show the quick filter component.
     * @default true
     */
    showQuickFilter: PropTypes.bool,
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: PropTypes.object,
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
    ]),
};
export { GridToolbar, GridToolbarDivider, GridToolbarLabel };
