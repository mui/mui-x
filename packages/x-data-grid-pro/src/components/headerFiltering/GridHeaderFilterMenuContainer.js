'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext, useGridSelector, } from '@mui/x-data-grid';
import refType from '@mui/utils/refType';
import useId from '@mui/utils/useId';
import { gridHeaderFilteringMenuSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
function GridHeaderFilterMenuContainer(props) {
    const { operators, item, field, buttonRef, headerFilterMenuRef, disabled = false, showClearItem, clearFilterItem, ...other } = props;
    const buttonId = useId();
    const menuId = useId();
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const menuOpenField = useGridSelector(apiRef, gridHeaderFilteringMenuSelector);
    const open = Boolean(menuOpenField === field && headerFilterMenuRef.current);
    const handleClick = (event) => {
        headerFilterMenuRef.current = event.currentTarget;
        apiRef.current.showHeaderFilterMenu(field);
    };
    if (!rootProps.slots.headerFilterMenu) {
        return null;
    }
    const label = apiRef.current.getLocaleText('filterPanelOperator');
    const labelString = label ? String(label) : undefined;
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseIconButton, { id: buttonId, ref: buttonRef, "aria-label": labelString, title: labelString, "aria-controls": menuId, "aria-expanded": open ? 'true' : undefined, "aria-haspopup": "true", tabIndex: -1, size: "small", onClick: handleClick, disabled: disabled, ...rootProps.slotProps?.baseIconButton, children: _jsx(rootProps.slots.baseBadge, { color: "primary", variant: "dot", badgeContent: showClearItem ? 1 : 0, children: _jsx(rootProps.slots.openFilterButtonIcon, { fontSize: "inherit" }) }) }), _jsx(rootProps.slots.headerFilterMenu, { field: field, open: open, item: item, target: headerFilterMenuRef.current, operators: operators, labelledBy: buttonId, id: menuId, clearFilterItem: clearFilterItem, showClearItem: showClearItem, ...other })] }));
}
GridHeaderFilterMenuContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    applyFilterChanges: PropTypes.func.isRequired,
    buttonRef: refType,
    clearFilterItem: PropTypes.func,
    disabled: PropTypes.bool,
    field: PropTypes.string.isRequired,
    headerFilterMenuRef: PropTypes.shape({
        current: PropTypes.object,
    }).isRequired,
    item: PropTypes.shape({
        field: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        operator: PropTypes.string.isRequired,
        value: PropTypes.any,
    }).isRequired,
    operators: PropTypes.arrayOf(PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        getValueAsString: PropTypes.func,
        headerLabel: PropTypes.string,
        InputComponent: PropTypes.elementType,
        InputComponentProps: PropTypes.shape({
            apiRef: PropTypes.shape({
                current: PropTypes.object.isRequired,
            }),
            applyValue: PropTypes.func,
            className: PropTypes.string,
            clearButton: PropTypes.node,
            disabled: PropTypes.bool,
            focusElementRef: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.shape({
                    current: PropTypes.any.isRequired,
                }),
            ]),
            headerFilterMenu: PropTypes.node,
            inputRef: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.shape({
                    current: (props, propName) => {
                        if (props[propName] == null) {
                            return null;
                        }
                        if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
                            return new Error(`Expected prop '${propName}' to be of type Element`);
                        }
                        return null;
                    },
                }),
            ]),
            isFilterActive: PropTypes.bool,
            item: PropTypes.shape({
                field: PropTypes.string.isRequired,
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                operator: PropTypes.string.isRequired,
                value: PropTypes.any,
            }),
            onBlur: PropTypes.func,
            onFocus: PropTypes.func,
            slotProps: PropTypes.object,
            tabIndex: PropTypes.number,
        }),
        label: PropTypes.string,
        requiresFilterValue: PropTypes.bool,
        value: PropTypes.string.isRequired,
    })).isRequired,
    showClearItem: PropTypes.bool,
};
export { GridHeaderFilterMenuContainer };
