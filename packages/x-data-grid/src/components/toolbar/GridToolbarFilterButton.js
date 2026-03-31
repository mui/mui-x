'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import useId from '@mui/utils/useId';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../../constants/cssVariables';
import { gridColumnLookupSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridFilterActiveItemsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridPanelContext } from '../panel/GridPanelContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['toolbarFilterList'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridToolbarFilterListRoot = styled('ul', {
    name: 'MuiDataGrid',
    slot: 'ToolbarFilterList',
})({
    margin: vars.spacing(1, 1, 0.5),
    padding: vars.spacing(0, 1),
});
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/filter-panel/ Filter Panel Trigger} component instead. This component will be removed in a future major release.
 */
const GridToolbarFilterButton = forwardRef(function GridToolbarFilterButton(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
    const badgeProps = slotProps.badge || {};
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const lookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const classes = useUtilityClasses(rootProps);
    const filterButtonId = useId();
    const filterPanelId = useId();
    const { filterPanelTriggerRef } = useGridPanelContext();
    const handleRef = useForkRef(ref, filterPanelTriggerRef);
    const tooltipContentNode = React.useMemo(() => {
        if (preferencePanel.open) {
            return apiRef.current.getLocaleText('toolbarFiltersTooltipHide');
        }
        if (activeFilters.length === 0) {
            return apiRef.current.getLocaleText('toolbarFiltersTooltipShow');
        }
        const getOperatorLabel = (item) => lookup[item.field].filterOperators.find((operator) => operator.value === item.operator)
            .label ||
            apiRef.current
                .getLocaleText(`filterOperator${capitalize(item.operator)}`)
                .toString();
        const getFilterItemValue = (item) => {
            const { getValueAsString } = lookup[item.field].filterOperators.find((operator) => operator.value === item.operator);
            return getValueAsString ? getValueAsString(item.value) : item.value;
        };
        return (_jsxs("div", { children: [apiRef.current.getLocaleText('toolbarFiltersTooltipActive')(activeFilters.length), _jsx(GridToolbarFilterListRoot, { className: classes.root, ownerState: rootProps, children: activeFilters.map((item, index) => ({
                        ...(lookup[item.field] && (_jsx("li", { children: `${lookup[item.field].headerName || item.field}
                  ${getOperatorLabel(item)}
                  ${
                            // implicit check for null and undefined
                            item.value != null ? getFilterItemValue(item) : ''}` }, index))),
                    })) })] }));
    }, [apiRef, rootProps, preferencePanel.open, activeFilters, lookup, classes]);
    const toggleFilter = (event) => {
        const { open, openedPanelValue } = preferencePanel;
        if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
            apiRef.current.hidePreferences();
        }
        else {
            apiRef.current.showPreferences(GridPreferencePanelsValue.filters, filterPanelId, filterButtonId);
        }
        buttonProps.onClick?.(event);
    };
    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnFilter) {
        return null;
    }
    const isOpen = preferencePanel.open && preferencePanel.panelId === filterPanelId;
    return (_jsx(rootProps.slots.baseTooltip, { title: tooltipContentNode, enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, ...tooltipProps, children: _jsx(rootProps.slots.baseButton, { id: filterButtonId, size: "small", "aria-label": apiRef.current.getLocaleText('toolbarFiltersLabel'), "aria-controls": isOpen ? filterPanelId : undefined, "aria-expanded": isOpen, "aria-haspopup": true, startIcon: _jsx(rootProps.slots.baseBadge, { badgeContent: activeFilters.length, color: "primary", ...rootProps.slotProps?.baseBadge, ...badgeProps, children: _jsx(rootProps.slots.openFilterButtonIcon, {}) }), ...rootProps.slotProps?.baseButton, ...buttonProps, onClick: toggleFilter, onPointerUp: (event) => {
                if (preferencePanel.open) {
                    event.stopPropagation();
                }
                buttonProps.onPointerUp?.(event);
            }, ref: handleRef, children: apiRef.current.getLocaleText('toolbarFilters') }) }));
});
GridToolbarFilterButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: PropTypes.object,
};
export { GridToolbarFilterButton };
